"use client";

import { motion, useInView } from "framer-motion";
import { useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Point = [number, number];

/** Smooth path through points using a Catmull-Rom → cubic Bézier conversion. */
function smoothPath(points: Point[], tension = 0.18): string {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) * tension;
    const c1y = p1[1] + (p2[1] - p0[1]) * tension;
    const c2x = p2[0] - (p3[0] - p1[0]) * tension;
    const c2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0]},${p2[1].toFixed(2)}`;
  }
  return d;
}

function toPoints(data: number[], width: number, height: number, min: number, max: number, pad = 4): Point[] {
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : 0;
  return data.map((v, i) => [Number((i * step).toFixed(2)), pad + (1 - (v - min) / range) * (height - pad * 2)]);
}

/**
 * Left-to-right reveal for charts. A clip rect is used instead of pathLength
 * because dash-based drawing breaks with non-scaling strokes on stretched SVGs.
 */
function RevealClip({ id, width, height, show }: { id: string; width: number; height: number; show: boolean }) {
  return (
    <clipPath id={id}>
      <motion.rect
        x="0"
        y="-4"
        height={height + 8}
        initial={{ width: 0 }}
        animate={{ width: show ? width : 0 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </clipPath>
  );
}

export function Sparkline({
  data,
  height = 40,
  color = "#00FF88",
  className,
  fill = true,
}: {
  data: number[];
  height?: number;
  color?: string;
  className?: string;
  fill?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const width = 200;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = toPoints(data, width, height, min, max);
  const line = smoothPath(points);
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={cn("w-full", className)} style={{ height }} aria-hidden>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <RevealClip id={`spc-${id}`} width={width} height={height} show={inView} />
      </defs>
      <g clipPath={`url(#spc-${id})`}>
        {fill && <path d={area} fill={`url(#sp-${id})`} />}
        <path d={line} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export type Series = { label: string; data: number[]; color: string };

/** Multi-series area chart with a hover crosshair. Axis text is HTML so it never stretches. */
export function AreaChart({
  series,
  labels,
  height = 220,
  unit = "",
  className,
  ariaLabel,
}: {
  series: Series[];
  labels: string[];
  height?: number;
  unit?: string;
  className?: string;
  ariaLabel: string;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hover, setHover] = useState<number | null>(null);
  const width = 600;
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all) * 1.12;
  const min = 0;
  const count = series[0]?.data.length ?? 0;

  const paths = useMemo(
    () =>
      series.map((s) => {
        const pts = toPoints(s.data, width, height, min, max, 2);
        const line = smoothPath(pts);
        return { line, area: `${line} L${width},${height} L0,${height} Z`, pts };
      }),
    [series, height, max],
  );

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (count - 1)));
  }

  const hoverLeft = hover === null ? 0 : (hover / (count - 1)) * 100;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className="relative"
        style={{ height }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={ariaLabel}
      >
        {/* grid */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-px w-full bg-[repeating-linear-gradient(90deg,rgba(242,247,244,0.07)_0_4px,transparent_4px_8px)]" />
          ))}
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.label} id={`ac-${id}-${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity={i === 0 ? 0.24 : 0.12} />
                <stop offset="1" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
            <RevealClip id={`acc-${id}`} width={width} height={height} show={inView} />
          </defs>
          <g clipPath={`url(#acc-${id})`}>
            {paths.map((p, i) => (
              <g key={series[i].label}>
                <path d={p.area} fill={`url(#ac-${id}-${i})`} />
                <path
                  d={p.line}
                  fill="none"
                  stroke={series[i].color}
                  strokeWidth={i === 0 ? 2 : 1.5}
                  strokeOpacity={i === 0 ? 1 : 0.8}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </g>
        </svg>
        {hover !== null && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0"
              style={{ left: `${hoverLeft}%` }}
              aria-hidden
            />
            {paths.map((p, i) => (
              <div
                key={series[i].label}
                className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg"
                style={{
                  left: `${hoverLeft}%`,
                  top: `${(p.pts[hover][1] / height) * 100}%`,
                  background: series[i].color,
                  boxShadow: `0 0 10px ${series[i].color}`,
                }}
                aria-hidden
              />
            ))}
            <div
              className="glass-strong pointer-events-none absolute top-2 z-10 min-w-[132px] rounded-xl px-3 py-2.5 text-[12px]"
              style={{
                left: `${hoverLeft}%`,
                transform: `translateX(${hoverLeft > 65 ? "calc(-100% - 12px)" : "12px"})`,
              }}
            >
              <p className="font-mono text-[11px] text-muted">{labels[hover]}</p>
              {series.map((s) => (
                <p key={s.label} className="mt-1 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-fg-2">
                    <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-mono text-fg">
                    {s.data[hover]}
                    {unit}
                  </span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[10.5px] text-subtle" aria-hidden>
        {labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0).map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function BarChart({
  data,
  labels,
  height = 120,
  color = "#00FF88",
  className,
  ariaLabel,
  highlight,
}: {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  className?: string;
  ariaLabel: string;
  /** Index of the bar to emphasise (defaults to the last). */
  highlight?: number;
}) {
  const max = Math.max(...data) || 1;
  const hi = highlight ?? data.length - 1;
  return (
    <div className={className}>
      <div className="flex items-end gap-[3px] sm:gap-1.5" style={{ height }} role="img" aria-label={ariaLabel}>
        {data.map((v, i) => (
          <div key={i} className="group/bar relative flex h-full flex-1 items-end">
            <motion.div
              className="w-full rounded-t-[4px] rounded-b-[2px]"
              style={{
                background:
                  i === hi
                    ? `linear-gradient(180deg, ${color}, ${color}66)`
                    : `linear-gradient(180deg, ${color}55, ${color}14)`,
                boxShadow: i === hi ? `0 0 16px -2px ${color}88` : undefined,
              }}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max(4, (v / max) * 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.025, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-fg opacity-0 transition-opacity group-hover/bar:opacity-100">
              {v}
            </span>
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-2.5 flex gap-[3px] font-mono text-[10px] text-subtle sm:gap-1.5" aria-hidden>
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function RadialGauge({
  value,
  max = 100,
  size = 120,
  stroke = 8,
  label,
  sublabel,
  color = "#00FF88",
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label: string;
  sublabel?: string;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label}: ${value} of ${max}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(242,247,244,0.07)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(242,247,244,0.05)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray="2 6"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" aria-hidden>
        <span className="text-[26px] font-semibold tracking-tight text-fg" style={{ fontVariantNumeric: "tabular-nums" }}>
          {value}
          {sublabel && <span className="text-sm font-medium text-muted">{sublabel}</span>}
        </span>
        <span className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted">{label}</span>
      </div>
    </div>
  );
}

export function Meter({
  value,
  label,
  tone = "primary",
  className,
}: {
  value: number;
  label: string;
  tone?: "primary" | "secondary" | "warn" | "danger";
  className?: string;
}) {
  const colors = {
    primary: "from-primary-600 to-primary",
    secondary: "from-secondary/70 to-secondary",
    warn: "from-warn/70 to-warn",
    danger: "from-danger/70 to-danger",
  } as const;
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-[12px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-fg-2">{value}%</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", colors[tone])}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
