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
You are a helpful assistant that can help me parse the input and determine the type of the event.
The event type can be one of the following: "task", "meeting", "event".
task is a task that the user needs to complete, usually come with a name, description, deadline and location.
meeting is a meeting with other people, usually come with a name, description, start time, end time and location.
event is a general event that the user is attending, usually come with a name, description, start time, end time and location.`;

const NPLSystemInstructionTask = `
You are a helpful assistant that can help me parse the input and extract the name, description, deadline and location of the task.
If such information is not provided, please leave it null except for the name. The deadline should after the current date.
Note: Time should be in Toronto time.`;

const NPLSystemInstructionMeeting = `
You are a helpful assistant that can help me parse the input and extract the name, description, start time, end time and location of the meeting.
If such information is not provided, please leave it null except for the name, start time and end time. The start time and end time should be after the current date.
rrule is the recurrence rule of the event, it should be in the format of "FREQ=[WEEKLY,DAILY,MONTHLY,YEARLY];INTERVAL=[integer];UNTIL=[YYYYMMDD];BYDAY=[MON,TUE,WED,THU,FRI,SAT,SUN]||{1,2,3...}; 
rrule should be null if the event is not recurring.
Note: Time should be in Toronto time.`;

const NPLSystemInstructionEvent = `
You are a helpful assistant that can help me parse the input and extract the name, description, start time, end time and location of the event.
If such information is not provided, please leave it null except for the name, start time and end time. The start time and end time should be after the current date.
rrule is the recurrence rule of the event, it should be in the format of "FREQ=[WEEKLY,DAILY,MONTHLY,YEARLY];INTERVAL=[integer];UNTIL=[YYYYMMDD];BYDAY=[MON,TUE,WED,THU,FRI,SAT,SUN]||{1,2,3...}; 
rrule should be null if the event is not recurring.
Note: Time should be in Toronto time.`;

export async function eventNPL(userInput: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: NPLSystemInstruction },
            { role: "user", content: userInput }],
        response_format: zodResponseFormat(z.object({
            eventType: z.enum(["task", "meeting", "event"]),
        }), "eventTypeSchema")
    });

    let result = completion.choices[0].message.content || "";
    result = JSON.parse(result).eventType;
    console.log("Event Type:", result);

    if (result === "task") {
        const completionTask = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: NPLSystemInstructionTask },
                { role: "user", content: `${userInput}, Current Time: ${new Date().toISOString()}` },
            ],
            response_format: zodResponseFormat(z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                location: z.string().optional(),
                deadline: z.string().optional(),
            }), "eventSchema")
        });
        return completionTask.choices[0].message.content 
        ? {type: result, ...JSON.parse(completionTask.choices[0].message.content)}
        : {};
    } else if (result === "meeting") {
        const completionMeeting = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: NPLSystemInstructionMeeting },
                { role: "user", content: `${userInput}, Current Time: ${new Date().toISOString()}` },
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
        return completionMeeting.choices[0].message.content
        ? {type: result, ...JSON.parse(completionMeeting.choices[0].message.content)}
        : {};
    } else if (result === "event") {
        const completionEvent = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: NPLSystemInstructionEvent },
                { role: "user", content: `${userInput}, Current Time: ${new Date().toISOString()}` },
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
        return completionEvent.choices[0].message.content
        ? {type: result, ...JSON.parse(completionEvent.choices[0].message.content)}
        : {};
    }
    return null;

    // return completion.choices[0].message.content;
}