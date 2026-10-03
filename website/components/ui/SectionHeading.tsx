import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-primary/[0.04] px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.14em] text-primary/90",
        className,
      )}
    >
      <span className="size-1 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,136,0.9)]" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "max-w-xl items-start",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
        {title}
      </h2>
      {description && <p className="text-pretty text-base leading-relaxed text-muted sm:text-[17px]">{description}</p>}
    </Reveal>
  );
}
