import express, { Express } from "express";
import cors from "cors";

import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

const app: Express = express();

const trpc = initTRPC.create();
const trpcRouter = trpc.router({
  hello: trpc.procedure.query(() => {
    return "Hello, World!"
  }),

  logtoserver: trpc.procedure.input((v) => {
    console.log(v);
    return "Logged!";
  }).mutation(req => {
    console.log("From client"+req.input);
  })
});
app.use(cors({ origin: "http://localhost:3125" }));
app.use("/trpc", createExpressMiddleware({router: trpcRouter}));
app.listen(3000 , () => console.log("Server running on http://localhost:3000"));

export type AppRouter = typeof trpcRouter;