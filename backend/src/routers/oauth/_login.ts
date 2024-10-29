import { trpc, authProcedure } from '../../trpc';
import { z } from 'zod';
import session from 'express-session';
import { TRPCError } from '@trpc/server';

// Here the procedure should be something all the routers should have
// z.someType is a varifer of the input from the client
// const userProcedure = authProcedure.input(z.object({userId: z.string()} ));

export const userRouter = trpc.router({

    // We set output here so even we pass in a password, it will not be returned
    // but you cannot miss anything in the output
    loginUser: trpc.procedure
    .input(z.object({username: z.string(), password: z.string()}))
    .mutation(async ({ input, ctx }) => {
        const { username, password } = input;
  
        // Step 1: Authenticate the user (pseudo code for example)
        const user = {id: username, name: password}; // Implement this function to check credentials  
        // Step 2: Set session data
  
        // Step 3: Return output, excluding sensitive information like password
        return { name: user.name, token: "sometoken"};
      }),

      varifyUser: authProcedure
      .query(() => {
          return "Hello, User!"
      }),
})