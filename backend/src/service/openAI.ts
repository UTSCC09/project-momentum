import OpenAI from "openai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

dotenv.config()
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemTemplate = 
`Provide list of events in the calendar {calendar} and the task {task}, find the best time slot to place this task.
 The task is provided with name, description, location and deadline, your job is find the
 1. duration of the task
 2. the best time slot to place the task in the calendar, should between current time and deadline
 These assumptions must take consider of what the event is, where is it happening, and the deadline of the task`;

 // test dara
 const calendar = JSON.stringify([{
    "name": "name1",
    "description": "description",
    "location": "location",
    "start_time": "2024-01-01T00:00:00.000Z",
    "end_time": "2024-01-01T01:00:10.000Z",
 },
 {
    "name": "name2",
    "description": "description",
    "location": "location",
    "start_time": "2024-01-02T02:00:00.000Z",
    "end_time": "2024-01-02T03:00:10.000Z",
 }])

 const task = JSON.stringify([{
    "name": "name",
    "description": "description",
    "location": "location",
    "deadline": "2024-01-03T04:00:10.000Z",
 }])

 const eventSchema = z.object({
    duration: z.number(),
    start_time: z.string(),
    end_time: z.string(),
  });

export async function getEventAttributes(task: any): Promise<any> {
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: systemTemplate },
            {
                role: "user",
                content: `Calendar: ${calendar}, Task: ${task}`,
            },
        ],
        response_format: zodResponseFormat(eventSchema, "eventSchema")
    });
    
    console.log(completion.choices[0].message.content);


    return {
        name: "name",
        description: "description",
        location: "location",
        start_time: "start_time",
        end_time: "end_time",
    };
}