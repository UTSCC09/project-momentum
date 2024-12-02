import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../../backend/src/index";

const host = import.meta.env.VITE_BACKEND_HOST || "localhost";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `https://${host}/api/trpc`,
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