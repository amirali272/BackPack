import type { Metadata } from "next";
import { Background } from "@/components/Background";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Servers, security, users, Telegram bots and logs in one console.",
  robots: { index: false },
};

export default function DashboardPage() {
  return (
    <>
      <Background />
      <DashboardShell />
    </>
  );
}
