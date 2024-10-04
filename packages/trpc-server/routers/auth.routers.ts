import { RegisterSchema } from "../schema/auth.schema";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@repo/db";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { AuthProviderType } from "@repo/db/types";
import { createUser, findUserByEmail } from "../services/user.service";
import { passwordHash } from "../services/auth.service";

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
});
