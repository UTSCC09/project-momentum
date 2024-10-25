import { trpc } from '../trpc';

export const userRouter = trpc.router({
    getUser: trpc.procedure.query(() => {
        return "Hello, User!"
    }),
})