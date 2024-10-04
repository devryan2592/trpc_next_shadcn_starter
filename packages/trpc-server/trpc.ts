// @ts-nocheck
import * as trpc from "@trpc/server/adapters/express";
import { initTRPC, TRPCError } from "@trpc/server";

import { transformer } from "./utils/trpcUtil";
import superjson from "superjson";
import { User } from "@repo/db/types";
import { findUserById } from "./services/user.service";
import { verifyJWT } from "./utils/jwt";

export const createContext = ({
  req,
  res,
}: trpc.CreateExpressContextOptions) => {
  let accessToken: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  console.log(req.cookies);

  return { req, res, accessToken };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;

export const publicProcedure = t.procedure;

const isAuthMiddleware = t.middleware(async (opts) => {
  const { accessToken } = opts.ctx;

  if (!accessToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No access token found",
    });
  }

  let uid: string;

  try {
    const decoded = verifyJWT(accessToken, "ACCESS_JWT_SECRET");

    uid = decoded.uid;
  } catch (error) {
    console.log(error);

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid access token",
    });
  }

  const userFound = await findUserById(uid);

  if (!userFound) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    });
  }

  return opts.next({
    ...opts,
    ctx: {
      ...opts.ctx,
      user: userFound,
    },
  });
});

export const privateProcedure = t.procedure.use(isAuthMiddleware);
