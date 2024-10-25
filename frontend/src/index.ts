import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import { AppRouter } from "../../backend/src/index"


const client = createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({url: "http://localhost:3000/trpc"})],
})

// Hello here is our router name, we can change it to like user or something else
async function main() {
    const hello = await client.hello.query();
    console.log(hello);

    const hello2 = await client.users.getUser.query({userId: "id"});
    console.log(hello2);

    // type safe, if you hover on result, you will see the type
    const hello3 = await client.users.createUser.mutate({userId: "id", name: "name"});
    console.log(hello3);

    // Password will not be returned
    const hello4 = await client.users.createUser2.mutate({userId: "id", name: "name"});
    console.log(hello4);
}
main()