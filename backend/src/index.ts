import express, { Express } from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { oauthRouter } from "./routers/google_oauth";

const app: Express = express();
app.use(cors({ origin: "http://localhost:5173" }));

import { trpcRouter } from "./routers/index";

app.get("/", (req, res) => {
    res.json("Hello, World!");
});

app.use("/api/oauth", oauthRouter);
app.use("/trpc", createExpressMiddleware({router: trpcRouter}));
app.listen(3000 , () => console.log("Server running on http://localhost:3000"));

export type AppRouter = typeof trpcRouter;