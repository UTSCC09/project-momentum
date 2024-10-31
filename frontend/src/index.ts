import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import { AppRouter } from "../../backend/src/index"

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

    const hello = await client.users.varifyUser.query();
    console.log(hello);
}

main();
