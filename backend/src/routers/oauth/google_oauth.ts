import { google } from "googleapis";
import { Router } from "express";
import { SignJWT, jwtVerify } from 'jose';

import { User } from "../../model/user/user";
import { Oauth } from "../../model/user/oauth";

import dotenv from "dotenv";
dotenv.config();

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-256-bit-secret'); //

const redirect_url =
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/oauth/google/googlecallback";

export const oauthGoogleRouter = Router();

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_url,
);

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    'https://www.googleapis.com/auth/calendar.readonly'
];

oauthGoogleRouter.post("/signin", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // use offline to get refresh token
    scope: scopes,
    prompt: "consent",
  });
  
    console.log("signin");
    res.json({ url });
});

oauthGoogleRouter.get("/googlecallback", async (req, res) => {
  const GOOGLE_ACCESS_TOKEN_URL='https://oauth2.googleapis.com/token'

  const { code } = req.query;

  const data = {
    code,
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: redirect_url,
    grant_type: "authorization_code",
  };

  const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const access_token_data = await response.json();
  // TODO: use refresh token to get new access token
  const { id_token } = access_token_data;
  

  const token_info_response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`
  );
  const token_info = await token_info_response.json();
  let kid = null;

  if (!token_info.kid) {
    console.log("Invalid token");
  }
  kid = token_info.kid;

  try {
    const googleOauth: any = await Oauth.findOne({
      where: { oauthId: kid },
      include: [{
        model: User,
        as: 'User',
      }],
    });
  
    if(googleOauth) {
      const token = await new SignJWT({ userId: (googleOauth.User as any).id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax',
      });
      res.cookie('userId', (googleOauth.User as any).id, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax',
      });

      res.redirect(`http://localhost:5173/?success=true&email=${(googleOauth.User as any).email}`);
      return;
    }
  } catch (error) {
    res.redirect(`http://localhost:5173/?success=false&error=${error}`);
    console.log(error);
  }

  // TODO: if user not exist, create user
  try {
    const user: any = await User.create({
      email: token_info.email,
      username: token_info.name,
    });
    const oauth: any = await Oauth.create({
      userId: user.id,
      oauthId: kid,
      password: null,
    });

    const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
    });

    res.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
    });

    res.redirect(`http://localhost:5173/?success=true&email=${user.email}`);
  } catch (error) {
    res.redirect(`http://localhost:5173/?success=false&error=${error}`);
    console.log(error);
  }
});

oauthGoogleRouter.get('/user', async (req, res) => {
  const { google_token } = req.query;
  const token_info_response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(google_token as string)}`
  );
  const token_info = await token_info_response.json();
  res.json(token_info);
});

// const temp = await oauth2Client.getToken(code as string);
// const tokens = temp.tokens;
// oauth2Client.setCredentials(tokens);

// const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
// const response2 = await calendar.events.list({
//   calendarId: 'primary',
//   timeMin: new Date().toISOString(),
//   maxResults: 10,
//   singleEvents: true,
//   orderBy: 'startTime',
// });
// const events = response2.data.items;
// console.log(events);