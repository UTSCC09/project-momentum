// const msal = require('@azure/msal-node');
import msal from "@azure/msal-node";
import { Router } from "express";

import dotenv from "dotenv";
dotenv.config();


const client_id = process.env.MICROSOFT_CLIENT_ID;
const client_secret = process.env.MICROSOFT_CLIENT_SECRET;
const redirect_uri = process.env.MICROSOFT_REDIRECT_URI;
const tenant_id = process.env.MICROSOFT_TENANT_ID;

export const oauthMicrosoftRouter = Router();

const microsoftAuthUrl = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/authorize`;
const scopes = ["openid", "profile", "email", "User.Read"];

// Step 1: Initiate sign-in by redirecting to Microsoft Auth URL
oauthMicrosoftRouter.post("/signin", (req, res) => {
    const url = `${microsoftAuthUrl}?client_id=${client_id}&response_type=code&redirect_uri=http://localhost:3000/api/oauth/microsoft/microsoftcallback&response_mode=query&scope=${encodeURIComponent(scopes.join(" "))}&state=12345`;
    res.json({ url });
});

// Step 2: Callback endpoint to receive the authorization code and exchange it for an access token
oauthMicrosoftRouter.get("/microsoftcallback", async (req, res) => {
    const { code } = req.query;
    const tokenUrl = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;
  
    const data = new URLSearchParams({
      client_id: client_id!,
      scope: scopes.join(" "),
      code: code as string,
      redirect_uri: redirect_uri!,
      grant_type: "authorization_code",
      client_secret: client_secret!,
    });
  
    // Exchange authorization code for access token
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    const tokenData = await tokenResponse.json();
    const { id_token } = tokenData;

    
  
    // Step 3: Verify the ID token and retrieve user information
    const userInfoResponse = await fetch(
      `https://graph.microsoft.com/v1.0/me`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );
  
    const userInfo = await userInfoResponse.json();

    console.log(userInfo);  
  
    // Redirect back to client app with the ID token
    res.redirect(`http://localhost:5173/?token=${encodeURIComponent(id_token)}`);
  });