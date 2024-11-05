import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const trpc = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();

export function createContext({ req, res }: CreateExpressContextOptions) {

  console.log(res);

  const authorization = req.headers.authorization || "";
  const userId = req.headers.uid || "";

  return {
    authorization : authorization,
    userId : userId,
    res,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;