import { trpc } from '../trpc';
import { z } from 'zod';
import session from 'express-session';

// Here the procedure should be something all the routers should have
// z.someType is a varifer of the input from the client
const userProcedure = trpc.procedure.input(z.object({userId: z.string()} ));

export const userRouter = trpc.router({
    // Need a userID here
    getUser: userProcedure.query(() => {
        return "Hello, User!"
    }),

    // Need a userID and a username here
    createUser: userProcedure.input(z.object({name: z.string()})).mutation(req => {
        return {name: req.input.name, userId: req.input.userId};
    }),

    // We set output here so even we pass in a password, it will not be returned
    // but you cannot miss anything in the output
    createUser2: userProcedure
    .input(z.object({name: z.string()}))
    .output(z.object({name: z.string(), userId: z.string()}))
    .mutation(req => {
        return {name: req.input.name, userId: req.input.userId, password: "password"};
    }),
})