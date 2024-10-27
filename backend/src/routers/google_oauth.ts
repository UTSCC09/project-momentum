import { google } from "googleapis";
import { Router } from "express";

import dotenv from "dotenv";
import { assert } from "console";
dotenv.config();

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
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
];

const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // use offline to get refresh token
    scope: scopes,
    prompt: "consent",
  });

oauthGoogleRouter.post("/signin", (req, res) => {
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
  const { id_token } = access_token_data;
  res.redirect(`http://localhost:5173/?google_token=${encodeURIComponent(id_token)}`);
});

oauthGoogleRouter.get('/user', async (req, res) => {
  const { google_token } = req.query;
  const token_info_response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(google_token as string)}`
  );
  const token_info = await token_info_response.json();
  res.json(token_info);
});