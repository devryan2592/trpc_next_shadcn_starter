import { LoginSchema, RegisterSchema } from "../schema/auth.schema";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { AuthProviderType, RefreshToken } from "@repo/db/types";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateRefreshToken,
} from "../services/user.service";
import { comparePassword, passwordHash } from "../services/auth.service";
import { generateTokens } from "../services/token.service";
import { getTokenExpiryDate } from "../utils/jwt";

export const authRoutes = router({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input }) => {
      const { name, email, password, image } = input;

      // check if user already exists
      const userExists = await findUserByEmail(email);

      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      const hashedPassword = await passwordHash(password);

      const user = await createUser({
        name,
        image,
        type: AuthProviderType.CREDENTIALS,
        Credentials: {
          email,
          passwordHash: hashedPassword,
        },
      });

      return {
        message: "User created successfully",
        data: user,
      };
    }),

  login: publicProcedure.input(LoginSchema).mutation(async ({ input, ctx }) => {
    try {
      const refreshTokenFromCookies: string = ctx.req.cookies.refreshToken;

      console.log("Refresh Token from Cookies:", refreshTokenFromCookies);

      const { email, password } = input;

      const user = await findUserByEmail(email);

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      const passwordMatch = await comparePassword(password, user.passwordHash);

      if (!passwordMatch) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid password",
        });
      }

      const { accessToken, refreshToken } = await generateTokens(user.user.uid);

      const userById = await findUserById(user.user.uid);

      if (!userById) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      const updateRefreshTokens = async (userId: string, newToken: string) => {
        const currentTime = new Date();
        const newTokenExpiry = await getTokenExpiryDate(newToken);

        const updatedTokens = [
          ...userById.refreshTokens.filter(
            (token) =>
              token.token !== refreshTokenFromCookies &&
              token.expiresAt > currentTime
          ),
          {
            uid: userId,
            token: newToken,
            createdAt: new Date(),
            expiresAt: newTokenExpiry,
          },
        ].slice(-10);

        console.log("Updated Tokens:", updatedTokens);

        await updateRefreshToken(user.user.uid, updatedTokens);

        return updatedTokens;
      };

      await updateRefreshTokens(user.user.uid, refreshToken);

      ctx.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
      });

      return {
        message: "User signed in successfully",
        data: { accessToken, refreshToken },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
});
