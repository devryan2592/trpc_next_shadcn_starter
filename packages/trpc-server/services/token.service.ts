import { signJWT } from "../utils/jwt";

export const generateTokens = async (uid: string) => {
  // Generate Access Token
  const accessToken = await signJWT(
    { uid },
    {
      expiresIn: "15m",
    },
    "ACCESS_JWT_SECRET"
  );

  // Generate Refresh Token
  const refreshToken = await signJWT(
    { uid },
    {
      expiresIn: "7d",
    },
    "REFRESH_JWT_SECRET"
  );

  return { accessToken, refreshToken };
};
