import { trpc } from '../../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { userProcedure } from '../../oauth/_login';
import { Event } from '../../../model/calendar/baseEvent/event';
import { Recursion } from '../../../model/calendar/utils/recursion';

export const eventRouter = trpc.router({

    createEvent: userProcedure
    .input(z.object({
        name: z.string(),
        description: z.string(),
        location: z.string(),
        time: z.string(),
        recurring: z.object({
            start: z.string(),
            end: z.string(),
            repeat: z.object({}),
        }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const uid = ctx.userId;
        let new_recurring: any = null;
        const { name, description, location, time, recurring } = input;

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
            const event = await Event.create({
                uid: uid,
                name: name,
                description: description,
                location: location,
                time: time,
                ...(new_recurring ? { recurring_id: new_recurring.id } : {})
            });

            return event;
        }
        catch (error){
            await Recursion.destroy({ where: { id: new_recurring.id } });
            console.log(error);
        }
    }),

    getEvent: userProcedure
    .input(z.object({eventId: z.string()}))
    .query(async ({ input }) => {
        const { eventId } = input;
        const event = await Event.findOne({ where: { id: eventId } });
        if (!event) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
        return event;
    }),

    getEventbyUser: userProcedure
    .input(z.object({userId: z.string()}))
    .query(async ({ input }) => {
        const { userId } = input;
        const events = await Event.findAll({ where: { uid: userId } });
        return events;
    }),

    updateEvent: userProcedure
    .input(z.object({
        eventId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        time: z.string().optional(),
        recurring: z.object({
            start: z.string(),
            end: z.string(),
            repeat: z.object({}),
        }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const { eventId, name, description, location, time, recurring } = input;
        
        try {
            const event = await Event.findOne({ where: { id: eventId } }) as any;
            if (!event) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
            if (event.uid !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

            event.name = name || event.name;
            event.description = description || event.description;
            event.location = location || event.location;
            event.time = time || event.time;
            const recurring_id = event.recurring_id;
            if (recurring){
                const update_recurring = await Recursion.findOne({ where: { id: recurring_id } }) as any;
                if (!update_recurring) throw new TRPCError({ code: 'NOT_FOUND', message: 'Recurring not found' });
                update_recurring.start = recurring.start;
                update_recurring.end = recurring.end;
                update_recurring.repeat = recurring.repeat;
                update_recurring.save();
            }

            await event.save();
            return event;
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
        return event;
    })
})