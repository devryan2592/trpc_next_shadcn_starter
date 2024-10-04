import { router } from "../trpc";
import { authRoutes } from "./auth.routers";

export const appRouter = router({
  auth: authRoutes,
});

export type AppRouter = typeof appRouter;
