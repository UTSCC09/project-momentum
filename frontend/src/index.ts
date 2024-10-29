import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import { AppRouter } from "../../backend/src/index"

// Declare a token variable that can be updated
let token: string | null = null;

const client = createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({
        url: "http://localhost:3000/trpc",
        async headers() {
            return {
                authorization: token ? `Bearer ${token}` : "",
            };
        }
    })],
});

async function main() {
    const hello2 = await client.users.loginUser.mutate({ username: "name", password: "pwd"});

    // Destructure the token from the response
    const { success, token : Token } = hello2;
    token = Token;  // Update the token variable

    // Now, subsequent requests will use the updated token
    const hello = await client.users.varifyUser.query();
    console.log(hello);

    const task = await client.tasks.getTask.query({userId: "1"});
    console.log(task);

    const event = await client.events.getEvent.query({userId: "1"});
    console.log(event);

    const meeting = await client.meetings.getMeeting.query({userId: "1"});
    console.log(meeting);
}

main();
