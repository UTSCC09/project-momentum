import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const trpc = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();

export function createContext({ req, res }: CreateExpressContextOptions) {

  const cookieHeader = req.headers.cookie;
  let token = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith("token="));
    
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }
  const userId = req.headers.uid || "";

  return {
    authorization : token,
    userId : userId,
    res,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;