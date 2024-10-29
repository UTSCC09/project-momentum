import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { auth } from "google-auth-library";

export const trpc = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();

export function createContext({ req, res }: CreateExpressContextOptions) {
  if(req.headers.authorization){
    return { authorization: req.headers.authorization};
  }
  return { authorization: 0};
}

const isloggedin = trpc.middleware(({ ctx, next }) => {
    if(!ctx.authorization){
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
});

export const authProcedure = trpc.procedure.use(isloggedin);
export type Context = inferAsyncReturnType<typeof createContext>;