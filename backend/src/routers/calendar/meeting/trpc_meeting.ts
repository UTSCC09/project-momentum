import { trpc } from '../../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userProcedure } from '../../oauth/_login';
import { Meeting } from '../../../model/calendar/baseEvent/meeting';
import { User } from '../../../model/user/user';
import { clearUserCalendarCache, updateUserEvents } from '../../../service/redis';
export const meetingRouter = trpc.router({

    createMeeting: userProcedure
    .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        start_time: z.string(),
        end_time: z.string(),
        project_id: z.string().optional(),
        rrule: z.string().optional(),
        participants: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const uid = ctx.userId;
        const { name, description = null, location = null , start_time,
             end_time, project_id = null, rrule= null, participants=null } = input;

        try{
            const participantUsers = [];
            if(participants !== null){
                for(const participant in participants){
                    const user: any  = await User.findOne({ where: { email: participant } });
                    // skip if user not found
                    if (!user) continue;
                    participantUsers.push(user.id);
                }
            }


            const meeting = await Meeting.create({
                uid: uid,
                name: name,
                description: description,
                location: location,
                start_time: start_time,
                end_time: end_time,
                ...(project_id ? { pid: project_id } : {}),
                ...(rrule ? { rrule: rrule } : {}),
                participants: participantUsers
            });

            // Update user cache
            await updateUserEvents(uid || "", meeting);
            await clearUserCalendarCache(uid || "");

            return {
                meeting: meeting,
                temp: "temp"
            };
        }
        catch (error){
            console.log(error);
        }
    }),

    getMeeting: userProcedure
    .input(z.object({meetingId: z.string()}))
    .query(async ({ input }) => {
        const { meetingId } = input;
        const meeting = await Meeting.findOne({ where: { id: meetingId } });
        if (!meeting) throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' });
        return {
            meeting: meeting,
            temp: "temp"
        };
    }),

    getMeetingbyUser: userProcedure
    .input(z.object({userId: z.string()}))
    .query(async ({ input }) => {
        const meetings = await Meeting.findAll({ where: { uid: input.userId } });
        return {
            meetings: meetings,
            temp: "temp"
        };
    }),

    getMeetingbyProject: userProcedure
    .input(z.object({projectId: z.string()}))
    .query(async ({ input }) => {
        const meetings = await Meeting.findAll({ where: { pid: input.projectId } });
        return {
            meetings: meetings,
            temp: "temp"
        };
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
        rrule: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const { meetingId, name, description, location, start_time, end_time, project_id, rrule } = input;

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
            meeting.rrule = rrule || meeting.rrule;
            await meeting.save();

            // Update user cache
            await updateUserEvents(meeting.uid || "", meeting);
            await clearUserCalendarCache(meeting.uid || "");

            return {
                meeting: meeting,
                temp: "temp"
            };
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
            await clearUserCalendarCache(meeting.uid || "");

            return {
                meeting: meeting,
                temp: "temp"
            };
        } catch (error){
            console.log(error);
        }
    }),
})