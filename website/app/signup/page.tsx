import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = { title: "Get started", description: "Create your Unknown Host account — 14-day trial, no credit card." };

export default function SignupPage() {
  return <AuthLayout mode="signup" />;
}
