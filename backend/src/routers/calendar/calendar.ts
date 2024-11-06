import { trpc } from '../../trpc';
import { z } from 'zod';
import { Op } from 'sequelize';
import { TRPCError } from '@trpc/server';

import { userProcedure } from '../oauth/_login';
import { Event } from '../../model/calendar/baseEvent/event';
import { Meeting } from '../../model/calendar/baseEvent/meeting';

export const taskRouter = trpc.router({

    createTask: userProcedure
    .input(z.object({
        userId: z.string().optional(),
        project_id: z.string().optional(),
        start_date: z.date(),
        end_date: z.date(),
    }))
    .query(async ({ input, ctx }) => {
        const uid = input.userId || ctx.userId;
        const { project_id, start_date, end_date } = input;

        // Check that end_date is after start_date
        if (end_date < start_date) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "End date must be after start date." });
        }

        const differenceInTime = end_date.getTime() - start_date.getTime();
        const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
        if (differenceInDays > 30) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Time Interval too Long" });
        }

        try {
            const meetings = await Meeting.findAll({
                where: {
                    uid: uid,
                    project_id: project_id,
                    start_time: { [Op.gte]: start_date},
                    end_time: { [Op.lte]: end_date }
                }
            });

            const events = await Event.findAll({
                where: {
                    uid: uid,
                    project_id: project_id,
                    time: { [Op.gte]: start_date, [Op.lte]: end_date},
                }
            });

            return {calendar: {meetings: meetings, events: events}};

        } catch (error) {
            console.log(error);
        }
    }),
})