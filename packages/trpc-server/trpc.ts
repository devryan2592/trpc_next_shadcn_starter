import { initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];

  return {
    req,
    res,
    token,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

// export const privateProcedure = (...roles: Role[]) =>
//   t.procedure.use(isAuth(roles));
