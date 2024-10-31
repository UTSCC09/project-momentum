import { trpc } from '../../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userProcedure } from '../../oauth/_login';

export const taskRouter = trpc.router({

    getTask: userProcedure
    .input(z.object({userId: z.string()}))
    .query(() => {
        return {
            taskId: "1",
            taskName: "Task 1",
            userId: "1",
            location: "Location 1",
            deadline: "2021-12-31",
            status: "Pending",
        }
    }),

})