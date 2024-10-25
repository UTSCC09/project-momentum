import express, { Express } from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
const app: Express = express();

import { trpcRouter } from "./routers/index";


app.use(cors({ origin: "http://localhost:3125" }));
app.use("/trpc", createExpressMiddleware({router: trpcRouter}));
app.listen(3000 , () => console.log("Server running on http://localhost:3000"));

export type AppRouter = typeof trpcRouter;