import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "success" | "warn" | "danger" | "info" | "neutral";

const tones: Record<Tone, { pill: string; dot: string }> = {
  success: { pill: "border-primary/25 bg-primary/[0.08] text-primary", dot: "bg-primary" },
  warn: { pill: "border-warn/25 bg-warn/[0.08] text-warn", dot: "bg-warn" },
  danger: { pill: "border-danger/30 bg-danger/[0.08] text-[#ff8a94]", dot: "bg-danger" },
  info: { pill: "border-secondary/25 bg-secondary/[0.08] text-secondary", dot: "bg-secondary" },
  neutral: { pill: "border-line-soft bg-white/[0.04] text-fg-2", dot: "bg-muted" },
};

export function Badge({
  tone = "neutral",
  dot,
  pulse,
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[12px] font-medium leading-5",
        t.pill,
        className,
      )}
    >
      {dot && (
        <span className="relative inline-flex size-1.5" aria-hidden>
          {pulse && <span className={cn("absolute inset-0 rounded-full opacity-60 animate-ping", t.dot)} />}
          <span className={cn("relative inline-flex size-1.5 rounded-full", t.dot)} />
        </span>
      )}
      {children}
    </span>
  );
}
