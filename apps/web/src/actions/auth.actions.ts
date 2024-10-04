import { cookies } from "next/headers";
import { trpcServer } from "../trpc/server";

export const getAccessToken = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  console.log("accessToken", accessToken);

  return accessToken?.value;
};

export const getRefreshToken = async () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken");

  console.log("refreshToken", refreshToken);

  return refreshToken?.value;
};

export const getUser = async () => {
  const user = await trpcServer.user.getUser.query();

  return user;
};
