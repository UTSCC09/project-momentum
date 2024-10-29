import { trpc } from '../../trpc';
import { z } from 'zod';
import { SignJWT, jwtVerify } from 'jose';
import { TRPCError } from '@trpc/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-256-bit-secret'); //TODO: change to actual secrete

const userProcedure = trpc.procedure.use(trpc.middleware(async ({ ctx, next }) => {
    const authHeader = ctx.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return next();
    } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
    }
}));

export const userRouter = trpc.router({

    createUser: trpc.procedure
    .input(z.object({username: z.string(), password: z.string(), email: z.string()}))
    .mutation(async ({ input, ctx }) => {
        let createStatus = false
        const { username, password, email } = input;
        const user = {id: username, name: password, email: email};
        
        // TODO: varify and store in DB

        createStatus = true;
        const userId = "User ID"; // TODO: change to actual user ID

        const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(JWT_SECRET);

        return { success: createStatus, token: token};
      }),

    loginUser: trpc.procedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
        const { username, password } = input;
        
        // TODO: replace with actual user authentication (e.g., check DB)
        const isValidUser = true;
        if (!isValidUser) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid username or password' });
        }

        const userId = "User ID"; // TODO: replace with actual user ID from DB

        const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(JWT_SECRET);

        return { success: true, token: token };
    }),

      varifyUser: userProcedure
      .query(() => {
          return "Hello, User!"
      }),
})