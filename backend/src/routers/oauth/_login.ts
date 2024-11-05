import { trpc } from '../../trpc';
import { z } from 'zod';
import { Op } from 'sequelize';
import cookie from 'cookie';
import { SignJWT, jwtVerify } from 'jose';
import { TRPCError } from '@trpc/server';
import { User } from '../../model/user/user';

import argon2 from 'argon2';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-256-bit-secret'); //TODO: change to actual secrete

export const userProcedure = trpc.procedure.use(trpc.middleware(async ({ ctx, next }) => {
    const authHeader = ctx.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;
        if (userId !== ctx.userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
        }
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

        const existingUser = await User.findOne({ where: {[Op.or]: [{ username }, { email }]} }) || null;
        if (existingUser) { throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' }); }
        
        try {
            const hashedPassword = await argon2.hash(password);
            const user = { username, password: hashedPassword, email };
            const createdUser = await User.create(user);
            createStatus = true;

            const token = await new SignJWT({ userId: (createdUser as any).id })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime("30d")
                .sign(JWT_SECRET);
            return { success: createStatus, user: createdUser, token: token };
        } catch (error) {
          console.error("Create User Error:", error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' });
      }
    }),

    loginUser: trpc.procedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input;
  
      try {
        // Find the user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
        }
  
        // Verify the password
        const isPasswordValid = await argon2.verify((user as any).password, password);
        if (!isPasswordValid) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Incorrect password' });
        }
  
        // Generate JWT token
        const token = await new SignJWT({ userId: (user as any).id })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime("30d")
          .sign(JWT_SECRET);

        ctx.res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=None; Secure`);
  
        return { success: true, user, token };
      } catch (error) {
        console.error("Login Error:", error);
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid login credentials' });
      }
    }),

    loginGoogleUser: trpc.procedure
    .input(z.object({  google_token: z.string() }))
    .mutation(async ({ input, ctx }) => {
        
    }),
})