import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#1dff97] to-primary-600 text-[#02150c] font-semibold " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_0_1px_rgba(0,255,136,0.45),0_8px_24px_-10px_rgba(0,255,136,0.55)] " +
    "hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_1px_rgba(0,255,136,0.6),0_14px_34px_-10px_rgba(0,255,136,0.6)]",
  secondary:
    "border border-line-soft bg-white/[0.03] text-fg backdrop-blur " +
    "hover:-translate-y-0.5 hover:border-line-strong hover:bg-white/[0.05] hover:shadow-[0_10px_30px_-14px_rgba(0,255,136,0.35)]",
  ghost: "text-fg-2 hover:bg-white/[0.05] hover:text-fg",
  danger:
    "border border-danger/30 bg-danger/10 text-[#ff8a94] hover:border-danger/50 hover:bg-danger/[0.16] hover:text-[#ffb0b7]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-[10px] px-3.5 text-[13px]",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-12 rounded-[14px] px-6 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, iconLeft, iconRight, className, children, disabled, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
});

type ButtonLinkProps = CommonProps & {
  href: string;
  external?: boolean;
  "aria-label"?: string;
  onClick?: () => void;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  children,
  external,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {iconLeft}
        {children}
        {iconRight}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}
