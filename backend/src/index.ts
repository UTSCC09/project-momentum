import express, { Express } from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import session from "express-session";

import { oauthGoogleRouter } from "./routers/google_oauth";
import { oauthMicrosoftRouter } from "./routers/microsoft_oauth";

import { redisRouter } from "./routers/redis";

const app: Express = express();
app.use(cors({ origin: "http://localhost:5173" }));

import { trpcRouter } from "./routers/trpc";

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

app.use("/api/oauth/google", oauthGoogleRouter);
app.use("/api/oauth/microsoft", oauthMicrosoftRouter);

app.use("/api/redis", redisRouter);

app.use("/trpc", createExpressMiddleware({router: trpcRouter}));
app.listen(3000 , () => console.log("Server running on http://localhost:3000"));

export type AppRouter = typeof trpcRouter;