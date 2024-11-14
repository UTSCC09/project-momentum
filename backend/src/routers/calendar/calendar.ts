import { trpc } from '../../trpc';
import { z } from 'zod';
import { Op } from 'sequelize';
import { TRPCError } from '@trpc/server';

import { userProcedure } from '../oauth/_login';
import { Event } from '../../model/calendar/baseEvent/event';
import { Meeting } from '../../model/calendar/baseEvent/meeting';
import { Recursion } from '../../model/calendar/utils/recursion';
export const calendarRouter = trpc.router({
    getCalendar: userProcedure
    .input(z.object({
        userId: z.string().optional(),
        project_id: z.string().optional(),
        start_date: z.string().date(),
        end_date: z.string().date(),
    }))
    .query(async ({ input, ctx }) => {
        const uid = input.userId || ctx.userId;
        const { project_id = null, start_date, end_date } = input;
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Check that end_date is after start_date
        if (endDate < startDate) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "End date must be after start date." });
        }

        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
        if (differenceInDays > 30) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Time Interval too Long" });
        }

        // Build where conditions dynamically based on available parameters
        const meetingWhereConditions : any = {}
        const eventWhereConditions: any = {};

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

            const eventConstCondition = {...eventWhereConditions};
            eventConstCondition.start_time = { [Op.gte]: startDate};
            eventConstCondition.end_time = { [Op.lte]: endDate };
            console.log(eventConstCondition);

            const eventsRecurringCondition = {...eventWhereConditions};
            eventsRecurringCondition.recurring = true;
            console.log(eventsRecurringCondition);

            const constEvents = await Event.findAll({
                where: eventWhereConditions,
            });

            const recurringEvents = await Event.findAll({
                where: eventsRecurringCondition,
                include: [{
                    model: Recursion,
                    as: 'Recursion',
                    required: false,
                    where: {
                        start: { [Op.lte]: endDate },
                        end: { [Op.gte]: startDate },
                    },
                }],
            });

            return { calendar: { meetings: meetings, events: constEvents, recurringEvents: recurringEvents} };
        } catch (error) {
            console.log(error);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "An error occurred while fetching data." });
        }
    }),
});
