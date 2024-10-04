import { getAccessToken } from "@/actions/auth.actions";
import { AppRouter } from "@repo/trpc-server/routers";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const trpcServer = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://127.0.0.1:3001/api/trpc",
      transformer: superjson,
      fetch: async (url, options) => {
        return fetch(url, {
          ...options,
          headers: {
            Cookie: `accessToken=${await getAccessToken()}`,
          },
          credentials: "include",
        });
      },
    }),
  ],
});
