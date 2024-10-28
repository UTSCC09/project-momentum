import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import session from "express-session";
import { createContext } from "./trpc"; 
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { loginRouter } from "./routers/oauth/_login";
import { oauthGoogleRouter } from "./routers/oauth/google_oauth";
import { oauthMicrosoftRouter } from "./routers/oauth/microsoft_oauth";

import { trpcRouter } from "./routers/trpc";
import { redisRouter } from "./routers/redis";

const app: Express = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json("Hello, World!");
});

app.use(
    session({
      secret: process.env.SESSION_SECRET || "your_secret_key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Use true if using HTTPS in production
    })
  );

app.use("/api/login", loginRouter);
app.use("/api/oauth/google", oauthGoogleRouter);
app.use("/api/oauth/microsoft", oauthMicrosoftRouter);

app.use("/api/redis", redisRouter);

app.use("/trpc", createExpressMiddleware({
  router: trpcRouter,
  createContext: createContext
}));
app.listen(3000 , () => console.log("Server running on http://localhost:3000"));

export type AppRouter = typeof trpcRouter;