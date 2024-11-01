import { trpc } from '../../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userProcedure } from '../../oauth/_login';
import { Meeting } from '../../../model/calendar/baseEvent/meeting';
import { Recursion } from '../../../model/calendar/utils/recursion';

export const meetingRouter = trpc.router({

    createMeeting: userProcedure
    .input(z.object({
        name: z.string(),
        description: z.string(),
        location: z.string(),
        start_time: z.string(),
        end_time: z.string(),
        project_id: z.string().optional(),
        recurring: z.object({
            start: z.string(),
            end: z.string(),
            repeat: z.object({}),
        }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const uid = ctx.userId;
        let new_recurring: any = null;
        const { name, description, location, start_time, end_time, project_id, recurring } = input;

        try{
            if (recurring){
                new_recurring = await Recursion.create({
                    start: recurring.start,
                    end: recurring.end,
                    repeat: recurring.repeat,
                });
            }
        } catch (error){
            console.log(error);
        }

        try{
            const meeting = await Meeting.create({
                uid: uid,
                name: name,
                description: description,
                location: location,
                start_time: start_time,
                end_time: end_time,
                ...(project_id ? { pid: project_id } : {}),
                ...(new_recurring ? { recurring_id: new_recurring.id } : {})
            });

            return meeting;
        }
        catch (error){
            await Recursion.destroy({ where: { id: new_recurring.id } });
            console.log(error);
        }
    }),

    

})