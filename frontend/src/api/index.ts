import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../../backend/src/index";

// Token and UID variables to store the latest values
let token: string | null = null;
let uid: string | null = null;

// Function to update token and uid dynamically
export function setAuthCredentials(newToken: string | null, newUid: string | null) {
  token = newToken;
  uid = newUid;
}

const host = import.meta.env.VITE_BACKEND_HOST || "localhost";
const port = import.meta.env.VITE_BACKEND_PORT || "3000";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://${host}:${port}/trpc`,
      // Define a custom fetch function to include credentials
      fetch: async (input, init) => {
        return fetch(input, {
          ...init,
          credentials: 'include', // Ensures cookies are included with requests
        });
      },
    }),
  ],
});


// async function main() {
  // const hello2 = await client.users.createUser.mutate({username: "test", password: "test", email: "test@email.com"});
  // const hello2 = await client.users.loginUser.mutate({ username: "test", password: "test" });
  // console.log(hello2);

  // if (hello2) {
  //   const user = hello2.user as { id: string, username: string, email: string };
  //   uid = user.id;
  //   token = hello2.token;
  // }

  // Create a task
  // const task = await client.tasks.createTask.mutate({
  //     name: "test",
  //     description: "test",
  //     location: "test",
  //     // only this format can be accepted by the database
  //     deadline: new Date().toISOString().slice(0, 19).replace('T', ' '),
  // });
  // console.log(task);

  // Get tasks of current user
  // let tasks = await client.tasks.getTask.query();
  // console.log(tasks);

  // Get tasks of a specific user
  // const userid: string = uid || "";
  // let tasks = await client.tasks.getTaskbyUser.query({userId: userid});
  // console.log(tasks);

  // Update a task
  // const taskid = '5cdf68d4-d535-4c78-a58e-f7a98831a730'
  // let tasks = await client.tasks.updateTask.mutate({
  //     taskId: taskid,
  //     name: "test3",
  //     // optional other fields
  // });
  // console.log(tasks);

  // Delete a task
  // const taskid = '5cdf68d4-d535-4c78-a58e-f7a98831a730'
  // let tasks = await client.tasks.deleteTask.mutate({
  //     taskId: taskid,
  // });

  // Create a meeting
  // const meeting: any = await client.meetings.createMeeting.mutate({
  //     name: "test",
  //     description: "test",
  //     location: "test",
  //     start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
  //     end_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
  //     recurring: {
  //         start: new Date().toISOString().slice(0, 19).replace('T', ' '),
  //         end: new Date().toISOString().slice(0, 19).replace('T', ' '),
  //         repeat: {},
  //     },
  // });
  // console.log(meeting);
  // const meeting2 = await client.meetings.getMeeting.query({meetingId: meeting.id});
  // console.log(meeting2);
  // const meeting3 = await client.meetings.updateMeeting.mutate({
  //     meetingId: meeting.id,
  //     name: "test10086",
  // });
  // console.log(meeting3);
  // const meeting4 = await client.meetings.deleteMeeting.mutate({meetingId: meeting.id});
  // console.log(meeting4);

  // Create an event
  // const event: any = await client.events.createEvent.mutate({
  //     name: "test",
  //     description: "test",
  //     location: "test",
  //     time: new Date().toISOString().slice(0, 19).replace('T', ' '),
  //     recurring: {
  //         start: new Date().toISOString().slice(0, 19).replace('T', ' '),
  //         end: new Date().toISOString().slice(0, 19).replace('T', ' '),
  //         repeat: {},
  //     },
  // });
  // console.log(event);
  // const event2 = await client.events.getEvent.query({eventId: event.id});
  // console.log(event2);
  // const event3 = await client.events.updateEvent.mutate({
  //     eventId: event.id,
  //     name: "test10086",
  // });
  // console.log(event3);

// }

// main();