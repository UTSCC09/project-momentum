import { trpc } from '../../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { userProcedure } from '../../oauth/_login';
import { Task } from '../../../model/calendar/baseEvent/task';
export const taskRouter = trpc.router({

    createTask: userProcedure
    .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        deadline: z.string().optional(),
        project_id: z.string().optional(),
        create_event: z.boolean().optional()
    }))
    .mutation(async ({ input, ctx }) => {
        const uid = ctx.userId;
        const { name, description = null, location = null, deadline = null, project_id = null, create_event } = input;

        try{
            const task = await Task.create({
                uid: uid,
                name: name,
                description: description,
                location: location,
                deadline: deadline,
                pid: project_id,
            });


            if (create_event){
                // await Event.create({
                //     uid: uid,
                //     ...eventAttributes,
                // });
            }

            return {
                task: task,
                temp: "temp"
            };
        } catch (error){
            console.log(error);
        }
    }),


    getTask: userProcedure
    .input(z.object({taskId: z.string()}))
    .query(async ({input, ctx}) => {
        const { taskId } = input;
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
        return {
            task: task,
            temp: "temp"
        };
    }),
    
    getTaskbyUser: userProcedure
    .input(z.object({
        userId: z.string(), 
        deadline: z.string().optional(),
        progress: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
        const { userId, deadline, progress } = input;
        const tasks = await Task.findAll({ 
            where: { 
                uid: userId, 
                ...(deadline ? { deadline: deadline } : {}),
                ...(progress ? { progress: progress } : {}),
            } });
        return {
            task: tasks,
            temp: "temp"
        };
    }),

    getTaskbyProject: userProcedure
    .input(z.object({
        projectId: z.string(), 
        deadline: z.string().optional(),
        progress: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
        const { projectId, deadline, progress } = input;
        const tasks = await Task.findAll({ 
            where: { 
                pid: projectId, 
                ...(deadline ? { deadline: deadline } : {}),
                ...(progress ? { progress: progress } : {}),
            } });
        return {
            task: tasks,
            temp: "temp"
        };
    }),

    updateTask: userProcedure
    .input(z.object({
        taskId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        deadline: z.string().optional(),
        project_id: z.string().optional(),
        progress: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const { 
            taskId, 
            name = null, 
            description = null, 
            location = null, 
            deadline = null, 
            project_id = null, 
            progress = null } = input;
        const task = await Task.findByPk(taskId) as any;

        if (!task) throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
        if (task.uid !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

        task.name = name || task.name;
        task.description = description || task.description;
        task.location = location || task.location;
        task.deadline = deadline || task.deadline;
        task.pid = project_id || task.pid;
        task.progress = progress || task.progress;
        await task.save();
        return {
            task: task,
            temp: "temp"
        };
    }),

    deleteTask: userProcedure
    .input(z.object({taskId: z.string()}))
    .mutation(async ({ input, ctx }) => {
        const { taskId } = input;
        const task = await Task.findByPk(taskId) as any;
        if (!task) throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });

        if (task.uid !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

        await task.destroy();
        return {
            task: task,
            temp: "temp"
        };
    }),

})