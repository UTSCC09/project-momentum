import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const trpc = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();

export function createContext({ req, res }: CreateExpressContextOptions) {
  if(req.headers.authorization)
    return { authorization: req.headers.authorization};
  return { authorization: ""};
}
export type Context = inferAsyncReturnType<typeof createContext>;