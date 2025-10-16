"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/api/axiosInstance";
const createUserSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "USER"], { error: "Role is required" }),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      const res = await axiosInstance.post("/users", payload);
      console.log("User created:", res.data);

      reset(); // clear form
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mt-10 border border-gray-700 bg-zinc-900 text-gray-100 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-100">
          Create New User
        </CardTitle>
        <CardDescription className="text-gray-400">
          Fill in the details to add a new user.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-300">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              {...register("firstName")}
              className={`bg-zinc-800 border-gray-700 text-gray-100 ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-300">
              Last Name <span className="text-gray-500">(optional)</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              className={`bg-zinc-800 border-gray-700 text-gray-100 ${
                errors.lastName ? "border-red-500" : ""
              }`}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className={`bg-zinc-800 border-gray-700 text-gray-100 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("role", value as "ADMIN" | "USER", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                id="role"
                className={`bg-zinc-800 border-gray-700 text-gray-100 ${
                  errors.role ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-gray-100 border-gray-700">
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
