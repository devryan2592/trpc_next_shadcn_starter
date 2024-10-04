import { prisma } from "@repo/db";
import { AuthProviderType, User } from "@repo/db/types";
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
