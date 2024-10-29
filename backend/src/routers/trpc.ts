import { trpc } from '../trpc';
import { userRouter } from './oauth/_login';

export const trpcRouter = trpc.router({

  // query: like a get request
  // mutation: like a post request
    users: userRouter
  });