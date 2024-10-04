import { router } from "../trpc";
import { authRoutes } from "./auth.routers";
import { userRoutes } from "./user.routers";

export const appRouter = router({
  auth: authRoutes,
  user: userRoutes,
});

export type AppRouter = typeof appRouter;
