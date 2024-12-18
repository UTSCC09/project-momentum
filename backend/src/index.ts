import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import { createContext } from "./trpc"; 
import { createWebSocketServer } from "./websocket";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { AIRouter } from "./service/openAI";
import { oauthGoogleRouter } from "./routers/oauth/google_oauth";
import { oauthMicrosoftRouter } from "./routers/oauth/microsoft_oauth";

import { trpcRouter } from "./routers/trpc";

import {connectDB} from "./datasource"
connectDB();

dotenv.config();

const app: Express = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/oauth/google", oauthGoogleRouter);
app.use("/api/oauth/microsoft", oauthMicrosoftRouter);
app.use("/api/openai", AIRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/trpc", createExpressMiddleware({
  router: trpcRouter,
  createContext: createContext
}));
const server = app.listen(3000 , '0.0.0.0', () => console.log("Server running"));
createWebSocketServer(server);

export type AppRouter = typeof trpcRouter;
