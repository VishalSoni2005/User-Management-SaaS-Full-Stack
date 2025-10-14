import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "@/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import { LoginFormData, SignupFormData } from "@/types";

export function AuthForm({ type }: { type: "signup" | "login" }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData | LoginFormData>({
    resolver: zodResolver(type === "login" ? loginSchema : signupSchema),
  });

  const onSubmitSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // const transformedData = {
      //   ...data,
      //   role: data.role === "admin" ? "admin" : "user",
      // }
      console.log("transformedData is : ", data);

      const res = await axiosInstance.post("/auth/signup", data);

      console.log("Signup successfuL", res.data);
      console.log("Access token:", res.data.access_token);
      localStorage.setItem("access_token", res.data.access_token);

      router.push("/dashboard");
    } catch (error) {
      console.log("Error in onSubmitSignup", error);
      // alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("data is : ", data);
      const res = await axiosInstance.post("/auth/login", data);
      console.log("Login successful", res.data);
      localStorage.setItem("access_token", res.data.accessToken);
      router.push("/dashboard");
    } catch (error) {
      console.log("Error in onSubmitLogin", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {type === "signup" ? (
        <Card className="w-full mt-16 h-auto max-w-md border-2">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-balance">
              Create an account
            </CardTitle>
            <CardDescription className="text-balance">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitSignup)} className="space-y-5">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Yolo"
                  {...register("firstName")}
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors &&
                  ("firstName" in errors ? (
                    <p className="text-sm text-destructive">
                      {errors.firstName.message}
                    </p>
                  ) : null)}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-sm font-medium">
                  Last Name{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="kumari"
                  {...register("lastName")}
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Yolo@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-destructive">*</span>
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

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("role", value as "admin" | "user", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    id="role"
                    className={errors.role ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div className="flex justify-center ">
                <p>Already have an account?</p>
                <button
                  type="button"
                  className="ml-2 text-primary underline hover:pointer-fine:underline hover:text-amber-500  "
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
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
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
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

              <div className="flex justify-center ">
                <p>Are You a new user?</p>
                <button
                  type="button"
                  className="ml-2 text-primary underline hover:pointer-fine:underline hover:text-amber-500  "
                  onClick={() => router.push("/signup")}
                >
                  Signup
                </button>
              </div>
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
      )}
    </>
  );
}

export default AuthForm;
