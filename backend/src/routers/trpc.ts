import { trpc } from '../trpc';

import { userRouter } from './oauth/_login';

import { taskRouter } from './calendar/task/trpc_task';
import { eventRouter } from './calendar/event/trpc_event';
import { meetingRouter } from './calendar/meeting/trpc_meeting';
import { calendarRouter } from './calendar/calendar';

export const trpcRouter = trpc.router({

  users: userRouter,

  tasks: taskRouter,

  events: eventRouter,
  
  meetings: meetingRouter,

  calendar: calendarRouter,

});