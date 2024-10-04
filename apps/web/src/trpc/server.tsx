import { AppRouter } from "@repo/trpc-server/routers";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const trpcServer = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://127.0.0.1:3001/api/trpc" })],
});
