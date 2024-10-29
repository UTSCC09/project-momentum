import { trpc } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userProcedure } from './oauth/_login';

export const eventRouter = trpc.router({

    getEvent: userProcedure
    .input(z.object({userId: z.string()}))
    .query(() => {
        return {
            eventId: "1",
            taskName: "Task 1",
            userId: "1",
            location: "Location 1",
            status: "Pending",
        }
    }),

})