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

oauthMicrosoftRouter.post("/signin", (req, res) => {
    const url = `${microsoftAuthUrl}
        ?client_id=${client_id}
        &response_type=code
        &redirect_uri=http://localhost:3000/api/oauth/microsoft/microsoftcallback
        &response_mode=query
        &scope=${encodeURIComponent(scopes.join(" "))}`;
    res.json({ url });
});

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
  
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    const tokenData = await tokenResponse.json();
    const { id_token } = tokenData;
    const { access_token } = tokenData;
    res.redirect(`http://localhost:5173/?microsoft_token=${encodeURIComponent(access_token)}`);
  });

  oauthMicrosoftRouter.get("/user", async (req, res) => {
    const { microsoft_token } = req.query;
    const userInfoResponse = await fetch(
      `https://graph.microsoft.com/v1.0/me`,
      {
        headers: {Authorization: `Bearer ${microsoft_token}`},
      }
    );
  
    const userInfo = await userInfoResponse.json();
    res.json(userInfo);
  });