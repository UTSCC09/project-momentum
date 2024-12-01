import { trpc } from '../../trpc';
import { z } from 'zod';
import { Op } from 'sequelize';
import { SignJWT, jwtVerify } from 'jose';
import { TRPCError } from '@trpc/server';

import { Redisclient } from '../../service/redis';
import { User } from '../../model/user/user';

import argon2 from 'argon2';
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-256-bit-secret'); //TODO: change to actual secrete

// auth middleware
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const uid = req.cookies.userId;
  const jwt = req.cookies.token;
  if (!uid || !jwt) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    await jwtVerify(jwt, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export const userProcedure = trpc.procedure.use(trpc.middleware(async ({ ctx, next }) => {
    const authHeader = ctx.authorization;

    const userStatus = await Redisclient.get(`${ctx.userId}`);
    if (userStatus === "loggedOut") {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'User logged out' });
    }

    if (!authHeader) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token missing or malformed' });
    }
    try {
        const { payload } = await jwtVerify(authHeader, JWT_SECRET);
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

          ctx.res.setHeader('Set-Cookie', [
            `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax;`,
            `userId=${(user as any).id}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax;`
          ]);
          
  
        return { success: true, user, token };
      } catch (error) {
        console.error("Login Error:", error);
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid login credentials' });
      }
    }),

    logoutUser: trpc.procedure
    .mutation(async ({ ctx }) => {
        ctx.res.setHeader('Set-Cookie', [
            `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`,
            `userId=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`
        ]);

        await Redisclient.set(`${ctx.userId}`, "loggedOut");
        // set expire time to be 30 days
        await Redisclient.expire(`${ctx.userId}`, 30 * 24 * 60 * 60);
        
        return { success: true };
    })
})