import { LoginSchema, RegisterSchema } from "../schema/auth.schema";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@repo/db";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { AuthProviderType } from "@repo/db/types";
import { createUser, findUserByEmail } from "../services/user.service";
import { comparePassword, passwordHash } from "../services/auth.service";
import { generateTokens } from "../services/token.service";

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

    return {
      message: "User signed in successfully",
      data: { accessToken, refreshToken },
    };
  }),
});
