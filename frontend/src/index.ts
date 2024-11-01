import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import { AppRouter } from "../../backend/src/index"
import { randomUUID } from "crypto";

// Declare a token variable that can be updated
let token: string | null = null;
let uid: string | null = null;

const client = createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({
        url: "http://localhost:3000/trpc",
        async headers() {
            return {
                authorization: token ? `Bearer ${token}` : "",
                uid: uid ? uid : "",
            };
        }
    })],
});

async function main() {
    // const hello2 = await client.users.createUser.mutate({username: "test", password: "test", email: "test@email.com"});
    const hello2 = await client.users.loginUser.mutate({username: "test", password: "test"});
    console.log(hello2);

    if(hello2){
        const user = hello2.user as { id: string, username: string, email: string };
        uid = user.id;
        token = hello2.token;
    }

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
    const meeting = await client.meetings.createMeeting.mutate({
        name: "test",
        description: "test",
        location: "test",
        start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        end_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        recurring: {
            start: new Date().toISOString().slice(0, 19).replace('T', ' '),
            end: new Date().toISOString().slice(0, 19).replace('T', ' '),
            repeat: {},
        },
    });
    console.log(meeting);
}

main();
