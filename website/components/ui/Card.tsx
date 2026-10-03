import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Adds hover elevation and an accent border. */
  interactive?: boolean;
};

export function Card({ className, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "glass edge rounded-2xl",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-line hover:shadow-[0_24px_60px_-30px_rgba(0,255,136,0.35)]",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</h3>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
