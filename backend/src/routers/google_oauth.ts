import { google } from "googleapis";
import { Router } from "express";

import dotenv from "dotenv";
dotenv.config();

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_url =
  process.env.REDIRECT_URL || "http://localhost:3000/api/oauth/googlecallback";

export const oauthRouter = Router();

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

oauthRouter.post("/signin", (req, res) => {
    // Signin logic here
    res.json({ url });
    // send a fetch to googlecallback
});

oauthRouter.get("/googlecallback", async (req, res) => {
  const GOOGLE_ACCESS_TOKEN_URL='https://oauth2.googleapis.com/token'

  const { code } = req.query;

  const data = {
    code,

    client_id: client_id,

    client_secret: client_secret,

    redirect_uri: "http://localhost:3000/api/oauth/googlecallback",

    grant_type: "authorization_code",
  };

  const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
    method: "POST",

    body: JSON.stringify(data),
  });

  const access_token_data = await response.json();

  const { id_token } = access_token_data;

  console.log(id_token);

  // verify and extract the information in the id token

  const token_info_response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
  );
  res.status(token_info_response.status).json(await token_info_response.json());
  res.redirect('http://localhost:5173/')
});