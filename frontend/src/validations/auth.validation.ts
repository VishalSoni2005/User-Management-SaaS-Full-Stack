import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string(),
  // .min(8, "Password must be at least 8 characters")
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  // ),
  role: z.enum(["admin", "user"], {
    error: "Please select a role",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});
