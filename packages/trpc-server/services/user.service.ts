import { prisma } from "@repo/db";
import { AuthProviderType, RefreshToken, User } from "@repo/db/types";
import { v4 as uuidv4 } from "uuid";

interface CreateUserInput {
  name: string;
  image?: string;
  type: AuthProviderType;
  Credentials: {
    email: string;
    passwordHash: string;
  };
}

const uid = uuidv4();

export const findUserByEmail = async (email: string) => {
  const user = await prisma.credentials.findUnique({
    where: {
      email,
    },
    include: {
      user: true,
    },
  });

  return user;
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      uid: id,
    },
    include: {
      refreshTokens: true,
    },
  });

  return user;
};

export const createUser = async (userDetails: CreateUserInput) => {
  const { name, image, type, Credentials } = userDetails;
  const user = await prisma.user.create({
    data: {
      uid,
      name,
      image,
      AuthProvider: { create: { type } },
      Credentials: { create: Credentials },
    },
  });

  return user;
};

export const updateRefreshToken = async (
  uid: string,
  updatedRefreshTokenArray: Omit<RefreshToken, "id" | "userId">[]
) => {
  await prisma.user.update({
    where: { uid },
    data: {
      refreshTokens: {
        deleteMany: {},
        create: updatedRefreshTokenArray.map((token) => ({
          token: token.token,
          createdAt: token.createdAt,
          expiresAt: token.expiresAt,
        })),
      },
    },
  });
};
