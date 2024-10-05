"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    if (!isLoaded) {
      return;
    }
    try {
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        toast({
          title: "Signed in",
          description: "You have been signed in",
        });
        router.push("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/sign-up"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Don't have an account? Go to Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
