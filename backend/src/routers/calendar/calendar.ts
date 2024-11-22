import { trpc } from '../../trpc';
import { z } from 'zod';
import { Op } from 'sequelize';
import { TRPCError } from '@trpc/server';

import { userProcedure } from '../oauth/_login';
import { Event } from '../../model/calendar/baseEvent/event';
import { Meeting } from '../../model/calendar/baseEvent/meeting';
import { meet } from 'googleapis/build/src/apis/meet';

export function getCalendarEvents( starttime: string, endtime: string, userId?: string, project_id?: string) {
    const eventConditions: any = {}
    eventConditions.start_time = { [Op.gte]: starttime};
    eventConditions.end_time = { [Op.lte]: endtime };
    if (userId) {
        eventConditions.uid = userId;
    }
    if (project_id) {
        eventConditions.project_id = project_id;
    }
    return Event.findAll({
        where: eventConditions,
    });
}

export const calendarRouter = trpc.router({
    getCalendar: userProcedure
    .input(z.object({
        userId: z.string().optional(),
        project_id: z.string().optional(),
        start_date: z.string(),
        end_date: z.string(),
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
        if (differenceInDays > 40) {
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
            meetingWhereConditions.start_time = { [Op.gte]: startDate};
            meetingWhereConditions.end_time = { [Op.lte]: endDate };


            const meetings = await Meeting.findAll({
                where: {
                    [Op.or]: [
                        meetingWhereConditions, 
                        { rrule: { [Op.ne]: null } }
                    ]
                }
            });
            
            eventWhereConditions.start_time = { [Op.gte]: startDate};
            eventWhereConditions.end_time = { [Op.lte]: endDate };

            const constEvents = await Event.findAll({
                where: {
                    [Op.or]: [
                        eventWhereConditions, 
                        { rrule: { [Op.ne]: null } }
                    ]
                },
            });
            

            return { calendar: { meetings: meetings, events: constEvents} };
        } catch (error) {
            console.log(error);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "An error occurred while fetching data." });
        }
    }),
});
