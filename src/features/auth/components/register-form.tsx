"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isPending = form.formState.isSubmitting;

  // Social Sign-ins
  const signInGithub = async () => {
    await authClient.signIn.social(
      { provider: "github" },
      {
        onSuccess: () => router.push("/workflows"),
        onError: (ctx) => {
  if (ctx.error.status === 403) {
    toast.error("Please verify your email address");
  } else {
    toast.error(ctx.error.message);
  }
  // Make sure nothing is returned
}
      }
    );
  };

  const signInGoogle = async () => {
    await authClient.signIn.social(
      { provider: "google" },
      {
        onSuccess: () => router.push("/workflows"),
        onError: (ctx) => {
  if (ctx.error.status === 403) {
    toast.error("Please verify your email address");
  } else {
    toast.error(ctx.error.message);
  }
  // Make sure nothing is returned
}
      }
    );
  };

  // Email Sign-up
  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully! ");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              {/* Social Login */}
              <div className="flex flex-col gap-4">
                <Button onClick={signInGithub} variant="outline" className="w-full" type="button" disabled={isPending}>
                  <Image width={20} height={20} alt="Github Logo" src="/github.svg" /> Continue with Github
                </Button>
                <Button onClick={signInGoogle} variant="outline" className="w-full" type="button" disabled={isPending}>
                  <Image width={20} height={20} alt="Google Logo" src="/google.svg" /> Continue with Google
                </Button>
              </div>

              {/* Email Sign-up */}
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="*******" type="password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="*******" type="password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Loader2Icon className="animate-spin" /> : "Sign Up"}
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
