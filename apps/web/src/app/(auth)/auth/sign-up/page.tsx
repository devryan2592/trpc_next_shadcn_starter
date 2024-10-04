"use client";

import { NextPage } from "next";
import Link from "next/link";

import { Button } from "@repo/ui/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import FormInputField from "@repo/ui/components/FormInputField";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/base/form";
import { FieldErrors } from "react-hook-form";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisterPageProps {
  // Add your page props here
}

const registerFormSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .superRefine(({ confirmPassword, password, ...rest }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    return rest;
  });

const RegisterPage: NextPage<RegisterPageProps> = ({}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, error } = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully", {
        description: "Please check your email for a verification link",
        action: (
          <Button onClick={() => router.push("/auth/sign-in")}>Sign in</Button>
        ),
      });
    },
    onError: () => {
      toast.error("Failed to create account");
    },
  });

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    const { firstName, lastName, ...rest } = data;

    const name = `${firstName} ${lastName}`;

    await mutate({ name, ...rest });
  };

  const onErrors = (
    errors: FieldErrors<z.infer<typeof registerFormSchema>>
  ) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className="mx-auto w-full max-w-sm"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-row space-x-4">
                <div className="flex flex-col gap-2">
                  <FormInputField
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    placeholder="Max"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormInputField
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Robinson"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <FormInputField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="m@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <FormInputField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="********"
                  required
                  type="password"
                />
              </div>
              <div className="grid gap-2">
                <FormInputField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="********"
                  required
                  type="password"
                />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default RegisterPage;
