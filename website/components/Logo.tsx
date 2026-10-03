import { useId } from "react";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  size?: number;
  className?: string;
  /** Draw the mark on its own dark tile (app icon / favicon style). */
  tile?: boolean;
};

/**
 * The Unknown Host mark: two interlocking arcs — a "U" and its 180° turn —
 * closing around a single host node. Built on a 32px grid so it holds up as a
 * 16px favicon.
 */
export function LogoMark({ size = 32, className, tile = true }: LogoMarkProps) {
  const id = useId().replace(/:/g, "");
  const stroke = `uh-stroke-${id}`;
  const fill = `uh-tile-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={stroke} x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FF88" />
          <stop offset="1" stopColor="#00C9A7" />
        </linearGradient>
        <linearGradient id={fill} x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F1D18" />
          <stop offset="1" stopColor="#070C0A" />
        </linearGradient>
      </defs>
      {tile && (
        <rect
          x="0.75"
          y="0.75"
          width="30.5"
          height="30.5"
          rx="9"
          fill={`url(#${fill})`}
          stroke="rgba(0,255,136,0.24)"
          strokeWidth="1"
        />
      )}
      <path d="M9 8v9a7 7 0 0 0 7 7" stroke={`url(#${stroke})`} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M23 24v-9a7 7 0 0 0-7-7" stroke={`url(#${stroke})`} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="13.6" y="13.6" width="4.8" height="4.8" rx="1" transform="rotate(45 16 16)" fill="#00FF88" />
    </svg>
  );
}

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      <span className="text-[15px] font-semibold tracking-[-0.01em] text-fg">
        Unknown<span className="text-muted font-medium"> Host</span>
      </span>
    </span>
  );
}
