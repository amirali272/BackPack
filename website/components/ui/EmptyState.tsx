import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "neutral" | "danger";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <div
        className={cn(
          "grid size-12 place-items-center rounded-2xl border",
          tone === "danger"
            ? "border-danger/25 bg-danger/[0.07] text-[#ff8a94]"
            : "border-line bg-primary/[0.05] text-primary",
        )}
      >
        {icon}
      </div>
      <h4 className="mt-4 text-[15px] font-semibold text-fg">{title}</h4>
      {description && <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
