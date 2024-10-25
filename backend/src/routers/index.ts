import { trpc } from '../trpc';
import { userRouter } from './users';

export const trpcRouter = trpc.router({
    hello: trpc.procedure.query(() => {
      return "Hello, World!"
    }),
  
    logtoserver: trpc.procedure.input((v) => {
      console.log(v);
      return "Logged!";
    }).mutation(req => {
      console.log("From client"+req.input);
    }),

    users: userRouter
  });