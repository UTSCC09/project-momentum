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

    getMeeting: userProcedure
    .input(z.object({meetingId: z.string()}))
    .query(async ({ input }) => {
        const { meetingId } = input;
        const meeting = await Meeting.findOne({ where: { id: meetingId } });
        return meeting;
    }),

    getMeetingbyUser: userProcedure
    .input(z.object({userId: z.string()}))
    .query(async ({ input }) => {
        const meetings = await Meeting.findAll({ where: { uid: input.userId } });
        return meetings;
    }),

    getMeetingbyProject: userProcedure
    .input(z.object({projectId: z.string()}))
    .query(async ({ input }) => {
        const meetings = await Meeting.findAll({ where: { pid: input.projectId } });
        return meetings;
    }),

    updateMeeting: userProcedure
    .input(z.object({
        meetingId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        start_time: z.string().optional(),
        end_time: z.string().optional(),
        project_id: z.string().optional(),
        recurring: z.object({
            recurringId: z.string(),
            start: z.string(),
            end: z.string(),
            repeat: z.object({}),
        }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const { meetingId, name, description, location, start_time, end_time, project_id, recurring } = input;

        try{
            const meeting = await Meeting.findOne({ where: { id: meetingId } }) as any;

            if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' });
            if (meeting.uid !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

            meeting.name = name || meeting.name;
            meeting.description = description || meeting.description;
            meeting.location = location || meeting.location;
            meeting.start_time = start_time || meeting.start_time;
            meeting.end_time = end_time || meeting.end_time;
            meeting.pid = project_id || meeting.pid;
            await meeting.save();

            if (recurring){
                const new_recurring = await Recursion.findOne({ where: { id: recurring.recurringId } }) as any;
                if (!new_recurring) throw new TRPCError({ code: 'NOT_FOUND', message: 'Recurring event not found' });
                new_recurring.start = recurring.start;
                new_recurring.end = recurring.end;
                new_recurring.repeat = recurring.repeat;
                await new_recurring.save();
            }

        } catch (error){
            console.log(error);
        }

    }),

    deleteMeeting: userProcedure
    .input(z.object({meetingId: z.string()}))
    .mutation(async ({ input, ctx }) => {
        const { meetingId } = input;
        try {
            const meeting = await Meeting.findOne({ where: { id: meetingId } }) as any;
            if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' });
            if (meeting.uid !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

            await meeting.destroy();
        } catch (error){
            console.log(error);
        }
    }),
})