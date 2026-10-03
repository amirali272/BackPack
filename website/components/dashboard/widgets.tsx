import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <Card className={cn("flex flex-col p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-semibold tracking-[-0.01em] text-fg">{title}</h3>
          {description && <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn("mt-5 flex-1", bodyClassName)}>{children}</div>
    </Card>
  );
}

export function StatTile({
  label,
  value,
  delta,
  deltaTone = "up",
  icon,
  children,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[12.5px] text-muted">
          {icon && <span className="text-primary/80">{icon}</span>}
          {label}
        </p>
        {delta && (
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 font-mono text-[10.5px]",
              deltaTone === "up" && "bg-primary/10 text-primary",
              deltaTone === "down" && "bg-danger/10 text-[#ff8a94]",
              deltaTone === "neutral" && "bg-white/[0.05] text-muted",
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <p className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-fg" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </p>
      {children && <div className="mt-3">{children}</div>}
    </Card>
  );
}

export function ViewHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-fg sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-[14px] text-muted">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

export function initials(name: string, fallback: string) {
  const source = name || fallback;
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Avatar({ name, email, size = 32 }: { name: string; email: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border border-line bg-gradient-to-br from-primary/20 to-secondary/10 font-medium text-fg"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials(name, email)}
    </span>
  );
}

export const tableClass = "w-full min-w-[640px] border-separate border-spacing-0 text-left text-[13px]";
export const thClass =
  "border-b border-line-soft px-4 py-3 text-[11.5px] font-medium uppercase tracking-[0.08em] text-subtle first:pl-5 last:pr-5";
export const tdClass = "border-b border-line-soft px-4 py-3.5 align-middle text-fg-2 first:pl-5 last:pr-5";
