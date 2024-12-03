import { trpc } from '../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { userProcedure } from '../oauth/_login';
import { User } from '../../model/user/user';
import { Project } from '../../model/calendar/project';
import { Op, Sequelize } from 'sequelize';
export const projectRouter = trpc.router({

    createProject: userProcedure
    .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        participants: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        const uid = ctx.userId;
        const { name, description = null, participants = null } = input;
        const participantId = [];

        if (participants !== null){
            for(const participant of participants){
                const user: any  = await User.findOne({ where: { email: participant } });
            // skip if user not found
            if (!user) continue;
            participantId.push(user.id);
            }
        }

        try{
            const project = await Project.create({
                name: name,
                description: description,
                participants: participantId,
                lead: uid
            });
            return {
                project: project,
                success: true
            }
        } catch (error){
            console.log(error);
            return {
                success: false,
                error: error
            }
        }
    }),

    getProjectbyLead: userProcedure
    .input(z.object({
        uid: z.string()
    }))
    .query(async ({ input, ctx }) => {
        const { uid } = input;
        const projects = await Project.findAll({ where: { lead: uid } });
        return {
            projects: projects,
            success: true
        }
    }),

    getProjectbyParticipant: userProcedure
    .input(z.object({
        uid: z.string()
    }))
    .query(async ({ input, ctx }) => {
        const { uid } = input;
        const projects = await Project.findAll({
            where: Sequelize.where(
                Sequelize.fn('JSON_CONTAINS', Sequelize.col('participants'), JSON.stringify([uid])),
                true
            )
        });
        
        return {
            projects: projects,
            success: true
        }
    }),

})