import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = { title: "Sign in", description: "Sign in to your Unknown Host account." };

export default function LoginPage() {
  return <AuthLayout mode="login" />;
}
