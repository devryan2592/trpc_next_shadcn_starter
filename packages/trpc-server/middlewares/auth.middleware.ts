import { findUserById } from "@/services/user.service";
import { verifyJWT } from "@/utils/jwt";
import { TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

export const isAuthMiddleware = async ({
  req,
  res,
  info,
}: trpcExpress.CreateExpressContextOptions) => {
  try {
    let accessToken;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    const notAuthenticatedResponse = {
      req,
      res,
      user: null,
      error: "Not authenticated",
    };

    if (!accessToken) return notAuthenticatedResponse;

    const decoded = verifyJWT(accessToken, "ACCESS_JWT_SECRET");

    if (!decoded) return notAuthenticatedResponse;

    const user = await findUserById(decoded.uid);

    if (!user) return notAuthenticatedResponse;

    return {
      req,
      res,
      user,
      info,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
};
