import { trpc } from '../trpc';
import { userRouter } from './trpc_users';

export const trpcRouter = trpc.router({

  // query: like a get request
  // mutation: like a post request
    users: userRouter
  });