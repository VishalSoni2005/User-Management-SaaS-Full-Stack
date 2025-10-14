import { loginSchema, signupSchema } from "@/validations";
import z from "zod";

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
