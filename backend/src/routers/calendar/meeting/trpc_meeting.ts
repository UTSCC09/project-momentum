import { trpc } from '../../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userProcedure } from '../../oauth/_login';

export const meetingRouter = trpc.router({

    getMeeting: userProcedure
    .input(z.object({userId: z.string()}))
    .query(() => {
        return {
            meetingId: "1",
            taskName: "Task 1",
            userId: "1",
            location: "Location 1",
            startTime: "2021-12-31",
            endTime: "2021-12-31",
        }
    }),

})