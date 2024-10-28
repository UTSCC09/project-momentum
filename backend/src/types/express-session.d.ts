// /types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user : {
      userId: string;
      username?: string;
      email?: string;
      password?: string;
      oauthGoogle: boolean;
      oauthMicrosoft: boolean;
      oauthGoogleAccessToken?: string;
      oauthGoogleRefreshToken?: string;
    }
  }
}