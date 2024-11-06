import { trpc } from '../../trpc';
import { z } from 'zod';
import { Op } from 'sequelize';
import { TRPCError } from '@trpc/server';

import { userProcedure } from '../oauth/_login';
import { Event } from '../../model/calendar/baseEvent/event';
import { Meeting } from '../../model/calendar/baseEvent/meeting';

export const calendarRouter = trpc.router({
    getCalendar: userProcedure
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

        // Build where conditions dynamically based on available parameters
        const meetingWhereConditions: any = { 
            start_time: { [Op.gte]: start_date },
            end_time: { [Op.lte]: end_date }
        };
        const eventWhereConditions: any = { 
            time: { [Op.gte]: start_date, [Op.lte]: end_date }
        };

        if (uid) {
            meetingWhereConditions.uid = uid;
            eventWhereConditions.uid = uid;
        }
        if (project_id) {
            meetingWhereConditions.project_id = project_id;
            eventWhereConditions.project_id = project_id;
        }

        try {
            const meetings = await Meeting.findAll({
                where: meetingWhereConditions,
            });

            const events = await Event.findAll({
                where: eventWhereConditions,
            });

            return { calendar: { meetings: meetings, events: events } };
        } catch (error) {
            console.log(error);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "An error occurred while fetching data." });
        }
    }),
});
