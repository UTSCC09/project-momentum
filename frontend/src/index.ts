import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import { AppRouter } from "../../backend/src/index"


const client = createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({url: "http://localhost:3000/trpc"})],
})

// Hello here is our router name, we can change it to like user or something else
async function main() {
    const hello = await client.hello.query();
    console.log(hello);
}
main()