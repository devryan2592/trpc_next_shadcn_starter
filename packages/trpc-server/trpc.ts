import * as trpc from "@trpc/server/adapters/express";
import { initTRPC, TRPCError } from "@trpc/server";

import { isAuthMiddleware } from "./middlewares/auth.middleware";

export const createContext = ({
  req,
  res,
  info,
}: trpc.CreateExpressContextOptions) => isAuthMiddleware({ req, res, info });

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const privateProcedure = t.procedure.use(isAuthenticated);
