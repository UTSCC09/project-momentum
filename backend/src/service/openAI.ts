import OpenAI from "openai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { Router } from "express";

import { getCalendarEvents } from "../routers/calendar/calendar";

dotenv.config()
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemTemplate = 
`Provide list of events in the calendar {calendar} and the task {task}, find the best time slot to place this task.
 The task is provided with name, description, location and deadline, your job is find the
 1. duration of the task
 2. the best time slot to place the task in the calendar, should between current time and deadline
 The start time and end time of the task should between starttime and endtime and after the current time
 These assumptions must take consider of what the event is, where is it happening, and the deadline of the task`;

 export const AIRouter = Router();

AIRouter.post("/getTaskSchedual", async (req, res) => {
    console.log(req.body);

    const { start_time, end_time } = req.body;
    const calendar = await getCalendarEvents(start_time, end_time);
    
    const { task } = req.body;
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemTemplate },
            {
                role: "user",
                content: `Calendar: ${calendar}, Task: ${task}, Start Time: ${start_time}, End Time: ${end_time}, Current Time: ${new Date().toISOString()}`,
            },
        ],
        response_format: zodResponseFormat(z.object({
            duration: z.number(),
            start_time: z.string(),
            end_time: z.string(),
        }), "eventSchema")
    });
    res.json(completion.choices[0].message.content);
});
