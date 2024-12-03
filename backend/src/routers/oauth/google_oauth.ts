import { google } from "googleapis";
import { Router, Request, Response, NextFunction } from "express";
import { SignJWT, jwtVerify } from "jose";
import { authMiddleware } from "./_login";

import { User } from "../../model/user/user";
import { Oauth } from "../../model/user/oauth";
import { Event } from "../../model/calendar/baseEvent/event";

import dotenv from "dotenv";
import { clearUserCalendarCache } from "../../service/redis";
dotenv.config();

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-256-bit-secret");

const redirect_url =
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/oauth/google/googlecallback";

export const oauthGoogleRouter = Router();

const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_url);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar.readonly",
];

// Route: Sign-in to Google
oauthGoogleRouter.post("/signin", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  res.json({ url });
});

// Route: Google OAuth callback
oauthGoogleRouter.get("/googlecallback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.redirect("https://momentum-app.ca/?success=false&error=No authorization code provided");
    return;
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const { id_token = "", refresh_token = "", access_token = "" } = tokens;

    if (!id_token) {
      res.redirect("https://momentum-app.ca/?success=false&error=No ID token received");
      return;
    }

    // Verify ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: id_token,
      audience: client_id,
    });

    oauth2Client.setCredentials({
      refresh_token: refresh_token,
    });
    

    const payload = ticket.getPayload();
    const kid = payload?.sub;

    if (!kid) {
      res.redirect("https://momentum-app.ca/?success=false&error=Invalid token payload");
      return;
    }

    // Check if the user already exists in the database
    const googleOauth:any = await Oauth.findOne({
      where: { oauthId: kid },
      include: [{ model: User, as: "User" }],
    });

    if (googleOauth) {
      const token = await new SignJWT({ userId: googleOauth.User.id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(JWT_SECRET);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });

      res.cookie("userId", googleOauth.User.id, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });

      res.redirect(`https://momentum-app.ca/?success=true&id=${googleOauth.User.id}`);
      return;
    }

    // Create a new user if not found
    const user: any = await User.create({
      email: payload?.email,
      username: payload?.name,
    });

    await Oauth.create({
      userId: user.id,
      oauthId: kid,
      password: null,
    });

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.cookie("userId", user.id, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.redirect(`https://momentum-app.ca/?success=true&id=${user.id}`);
  } catch (error) {
    console.error("Error during Google callback:", error);
    res.redirect(`https://momentum-app.ca/?success=false&error=${encodeURIComponent(error as string)}`);
  }
});

oauthGoogleRouter.get("/calendar", authMiddleware, async (req, res) => {
  try{
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response2 = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 10,
    });
    const events = response2.data.items;
    if(events === undefined){
      res.status(500).json({ error: "Failed to fetch calendar events" });
      return;
    }

    for(const event of events as any){
      try{
        const newEvent = await Event.create({
          id: event.id.slice(0, 36),
          uid: req.cookies.userId,
          name: event.summary || "No Title",
          description: event.description || "",
          location: event.location || "",
          start_time: event.start.dateTime,
          end_time: event.end.dateTime,
        });
      } catch (error) {
        console.log("Error creating event:", error);
      }

      clearUserCalendarCache(req.cookies.userId);
    }
    res.json(events);
  } catch (error) {
    console.error("Error during Google calendar:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
})

export default oauthGoogleRouter;
