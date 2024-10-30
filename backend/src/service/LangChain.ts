import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import dotenv from "dotenv";

dotenv.config()

const model = new ChatOpenAI({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY });
const parser = new StringOutputParser();

const systemTemplate = 
"Provide the calendar {calendar} and the task {task}, find the best time slot to place this task. The output should only contain time slot in format of [starttime - endtime]";
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate]
]);
const llmChain = promptTemplate.pipe(model).pipe(parser);

type CalendarEvent = {
    id: string;
    name: string;
    uid: string;
    location: string;
    time: string;
    info: string;
    recurring: string | null;
};

type Task = {
    id: string;
    name: string;
    uid: string;
    location: string;
    deadline: string;
    info: string;
    status: string;
    project_id: string | null;
};

function transformCalendar(calendar: CalendarEvent[]): string {
    return calendar.map(event => {
        return `Event: ${event.name}, Location: ${event.location}, Time: ${event.time}, Info: ${event.info}, Recurring: ${event.recurring || "none"}`;
    }).join("\n");
}

function transformTask(task: Task): string {
    return `Task: ${task.name}, Location: ${task.location}, Deadline: ${task.deadline}, Info: ${task.info}, Status: ${task.status}, Project ID: ${task.project_id || "none"}`;
}


const test_calendar = [
    {
        id: "1",
        name: "Team Meeting",
        uid: "user_123",
        location: "Zoom",
        time: "10:00:00",
        info: "Weekly sync with the team",
        recurring: "weekly"
    },
    {
        id: "2",
        name: "Project Demo",
        uid: "user_456",
        location: "Office",
        time: "14:00:00",
        info: "Client presentation and Q&A",
        recurring: null
    },
    {
        id: "3",
        name: "Coding Session",
        uid: "user_123",
        location: "Home",
        time: "16:00:00",
        info: "Focused work on feature X",
        recurring: "daily"
    },
    {
        id: "4",
        name: "Doctor Appointment",
        uid: "user_789",
        location: "Clinic",
        time: "09:30:00",
        info: "Annual health check-up",
        recurring: null
    },
    {
        id: "5",
        name: "Lunch with Mentor",
        uid: "user_123",
        location: "Cafe",
        time: "12:00:00",
        info: "Monthly mentorship discussion",
        recurring: "monthly"
    }
];

const test_task = {
    id: "task_001",
    name: "Design Wireframes",
    uid: "user_123",
    location: "Remote",
    deadline: "2024-11-05 17:00:00",
    info: "Create wireframes for the new project feature",
    status: "in_progress", // This should match an `id` in your `Status` table
    project_id: "project_001", // This should match an `id` in your `Project` table
};


// Applying the transformer
const calendarText: string = transformCalendar(test_calendar);
const taskText: string = transformTask(test_task);

// Modified printai function with TypeScript typing
export async function printai(): Promise<void> {
    const result = await llmChain.invoke({ calendar: calendarText, task: taskText });
    console.log(result);
}