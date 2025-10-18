/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import type { LoginFormData } from "@/types";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ServerError, setServerError] = useState<string | null>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    console.log("User login credential: ", data);

    try {
      const res = await axiosInstance.post(
        "http://localhost:4000/auth/login",
        data
      );

      console.log(res.data.message);
      localStorage.setItem("access_token", res.data.access_token);
      router.push("/dashboard");
    } catch (error: any) {
      console.log("Error in onSubmitLogin", error);

      if (error.response?.data?.message) {
        setServerError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response.data.message
        );
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mt-16 h-auto max-w-md border-2">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
              
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <p>Are you a new user?</p>
            <button
              type="button"
              className="ml-2 text-primary underline hover:text-amber-500"
              onClick={() => router.push("/signup")}
            >
              Signup
            </button>
          </div>

          {ServerError && (
            <p className="text-sm text-destructive">{ServerError}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
