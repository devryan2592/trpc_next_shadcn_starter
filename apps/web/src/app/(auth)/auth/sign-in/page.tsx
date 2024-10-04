"use client";

import { NextPage } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import { Form } from "@repo/ui/components/base/form";
import FormInputField from "@repo/ui/components/FormInputField";
import { trpc } from "@/trpc/client";

interface SignInPageProps {
  // Add your page props here
}

const signInFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const SignInPage: NextPage<SignInPageProps> = ({}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("Signed in successfully");
      //   router.push("/dashboard"); // Redirect to dashboard or appropriate page
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
    await mutate(data);
  };

  const onErrors = (errors: FieldErrors<z.infer<typeof signInFormSchema>>) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className="w-full max-w-sm mx-auto"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 ">
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
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <Button variant="outline" className="w-full">
                Sign in with GitHub
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default SignInPage;
