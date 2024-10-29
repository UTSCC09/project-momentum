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

    // const hello0 = await client.users.varifyUser.query();
    // console.log(hello0);
    // Perform login and update the token
    const hello2 = await client.users.loginUser.mutate({ username: "id", password: "name" });
    console.log(hello2);

    // Destructure the token from the response
    const { name, token: newToken } = hello2;
    token = newToken;  // Update the token variable

    // Now, subsequent requests will use the updated token
    const hello = await client.users.varifyUser.query();
    console.log(hello);
}

main();
