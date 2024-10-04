import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export interface JwtPayloadExtended extends JwtPayload {
  uid: string;
}

export const signJWT = (
  payload: string | Buffer | object,
  options: SignOptions,
  key: "ACCESS_JWT_SECRET" | "REFRESH_JWT_SECRET"
) => {
  const secret = process.env[key]! as string;

  if (!secret) {
    throw new Error("JWT secret not found");
  }

  return jwt.sign(payload, secret, {
    ...(options && options),
    algorithm: "HS256",
  });
};

export const verifyJWT = (
  token: string,
  key: "ACCESS_JWT_SECRET" | "REFRESH_JWT_SECRET"
) => {
  const secret = process.env[key]! as string;

  if (!secret) {
    throw new Error("JWT secret not found");
  }

  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as JwtPayloadExtended;
};
