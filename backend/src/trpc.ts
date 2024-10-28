import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const trpc = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();

export function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
    user: {
        id_token: req.session.cookie,
        user: req.session.user || null
    }
  };
}