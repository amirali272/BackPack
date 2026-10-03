"use client";

import { cn } from "@/lib/cn";

export function Switch({
  checked,
  onChange,
  label,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Accessible name; rendered visually hidden. */
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-200",
        checked ? "border-primary/50 bg-primary/25" : "border-line-soft bg-white/[0.06]",
        disabled && "opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block size-4 rounded-full shadow transition-transform duration-200 ease-out",
          checked ? "translate-x-[19px] bg-primary shadow-[0_0_10px_rgba(0,255,136,0.6)]" : "translate-x-[3px] bg-fg-2",
        )}
      />
    </button>
  );
}
