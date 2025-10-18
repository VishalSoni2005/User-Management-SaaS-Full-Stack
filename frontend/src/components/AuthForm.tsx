"use client";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export function AuthForm({ type }: { type: "signup" | "login" }) {
  return type === "signup" ? <SignupForm /> : <LoginForm />;
}

export default AuthForm;
