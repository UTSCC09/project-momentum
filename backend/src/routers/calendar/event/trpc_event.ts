import { trpc } from '../../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userProcedure } from '../../oauth/_login';
import { Event } from '../../../model/calendar/baseEvent/event';

export const eventRouter = trpc.router({

    createEvent: userProcedure
    .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        start_time: z.string(),
        end_time: z.string(),
        rrule: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const uid = ctx.userId;
        let new_recurring: any = null;
        const { name, description = null, location = null, start_time, end_time, rrule = null } = input;

        console.log(name, description, location, start_time, end_time, rrule);
        try{
            const event = await Event.create({
                uid: uid,
                name: name,
                description: description,
                location: location,
                start_time: start_time,
                end_time: end_time,
                ...(rrule ? { rrule: rrule } : {})
            });
            return {
                event: event,
                temp: "temp"
            };
        }
        catch (error){
            console.log(error);
        }
    }),

    getEvent: userProcedure
    .input(z.object({eventId: z.string()}))
    .query(async ({ input }) => {
        const { eventId } = input;
        const event = await Event.findOne({ where: { id: eventId } });
        if (!event) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
        return {
            event: event,
            temp: "temp"
        };
    }),

    getEventbyUser: userProcedure
    .input(z.object({userId: z.string()}))
    .query(async ({ input }) => {
        const { userId } = input;
        const events = await Event.findAll({ where: { uid: userId } });
        return {
            event: events,
            temp: "temp"
        };
    }),

    updateEvent: userProcedure
    .input(z.object({
        eventId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        start_time: z.string().optional(),
        end_time: z.string().optional(),
        rrule: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const { eventId, name, description, location, start_time, end_time, rrule } = input;
        
        try {
            const event = await Event.findOne({ where: { id: eventId } }) as any;
            if (!event) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
            if (event.uid !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

            event.name = name || event.name;
            event.description = description || event.description;
            event.location = location || event.location;
            event.start_time = start_time || event.start_time;
            event.end_time = end_time || event.end_time;
            event.rrule = rrule || event.rrule;
            await event.save();
            return {
                event: event,
                temp: "temp"
            };
        }
        catch (error){
            console.log(error);
        }
    }),

    deleteEvent: userProcedure
    .input(z.object({eventId: z.string()}))
    .mutation(async ({ input, ctx }) => {
        const { eventId } = input;
        const event = await Event.findOne({ where: { id: eventId } }) as any;
        if (!event) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
        if (event.uid !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

        await event.destroy();
        return {
            event: event,
            temp: "temp"
        };
    })
})