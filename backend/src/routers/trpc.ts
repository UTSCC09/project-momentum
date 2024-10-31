import { trpc } from '../trpc';
import { userRouter } from './oauth/_login';
import { taskRouter } from './trpc_task';
import { eventRouter } from './trpc_event';
import { meetingRouter } from './trpc_meeting';

export const trpcRouter = trpc.router({

  users: userRouter,

  tasks: taskRouter,

  events: eventRouter,
  
  meetings: meetingRouter,

});