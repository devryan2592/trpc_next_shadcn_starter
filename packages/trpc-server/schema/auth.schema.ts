import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }).min(1),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    image: z.string().optional(),
    password: z.string({ required_error: "Password is required" }).min(6),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string({ required_error: "Password is required" }).min(6),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string({ required_error: "Refresh token is required" }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
