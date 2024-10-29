import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from 'body-parser';

import { createContext } from "./trpc"; 
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { oauthGoogleRouter } from "./routers/oauth/google_oauth";
import { oauthMicrosoftRouter } from "./routers/oauth/microsoft_oauth";

import { trpcRouter } from "./routers/trpc";

import {connectDB} from "./datasource"
connectDB()

const app: Express = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyParser.json());

app.use("/api/oauth/google", oauthGoogleRouter);
app.use("/api/oauth/microsoft", oauthMicrosoftRouter);

app.use("/trpc", createExpressMiddleware({
  router: trpcRouter,
  createContext: createContext
}));
app.listen(3000 , () => console.log("Server running on http://localhost:3000"));

export type AppRouter = typeof trpcRouter;