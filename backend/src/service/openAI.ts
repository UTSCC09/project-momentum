import OpenAI from "openai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { Router } from "express";

import { getCalendarEvents, getCalendarEventsFromCache } from "../routers/calendar/calendar";

dotenv.config()
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemTemplate = 
`You are tasked with scheduling a new task within a user's calendar. Here is the information you need:
1. Calendar Events: {calendar}
2. Task Details: {task}
3. Previous User Events: {previousEvents}

Your objectives are:
- Identify the optimal time slot for the task, ensuring it fits between the current time and the task's deadline.
- If the task is related to any previous events (based on name or description), aim to schedule it at the same time and duration as those events.

Considerations:
- Ensure the task's start and end times fall within the provided start_time and end_time, and are after the current time.
- Take into account the nature of the event, its location, task description, and deadline.

Note: All times should be in Toronto time, including the task's start and end times, as well as the input start_time and end_time.`;

export const AIRouter = Router();

export async function getTaskSchedual(name: string, description: string, location: string, deadline: string, start_time: string, end_time: string, uid: string) {
    const calendar = await getCalendarEvents(start_time, end_time);
    const previousEvents = await getCalendarEventsFromCache(uid);
    const task = `${name}, ${description}, ${location}, ${deadline}`;

    console.log("Previous Events:", previousEvents);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemTemplate },
            {
                role: "user",
                content: `Calendar: ${calendar}, Task: ${task}, Previous Events: ${previousEvents}, Start Time: ${start_time}, End Time: ${end_time}, Current Time: ${new Date().toISOString()}`,
            },
        ],
        response_format: zodResponseFormat(z.object({
            start_time: z.string(),
            end_time: z.string(),
        }), "eventSchema")
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

const NPLSystemInstruction = `
You are a helpful assistant that can help me parse the input and extract the name, description, location, start time and end time of the event
rrule is the recurrence rule of the event, it should be in the format of "FREQ=[WEEKLY,DAILY,MONTHLY,YEARLY];INTERVAL=[integer];UNTIL=[YYYYMMDD];BYDAY=[MON,TUE,WED,THU,FRI,SAT,SUN];"`;

export async function eventNPL(input: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "some system instruction" },
            { role: "user", content: input },
        ],
        response_format: zodResponseFormat(z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            location: z.string().optional(),
            start_time: z.string().optional(),
            end_time: z.string().optional(),
            rrule: z.string().optional(),
        }), "eventSchema")
    });
    return completion.choices[0].message.content;
}