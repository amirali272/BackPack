"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { Sparkline } from "@/components/charts";

/** Connection paths from each server block into the core (viewBox 560×520). */
const links = [
  { id: "a", d: "M150 118 C 214 118, 214 214, 238 226", dur: "3.2s" },
  { id: "b", d: "M412 262 C 372 262, 360 260, 330 260", dur: "2.6s" },
  { id: "c", d: "M172 410 C 230 410, 222 318, 240 296", dur: "3.6s" },
  { id: "d", d: "M440 96 C 380 96, 360 170, 318 222", dur: "4.2s" },
  { id: "e", d: "M420 430 C 360 430, 350 344, 316 300", dur: "3.9s" },
];

const nodes = [
  [440, 96],
  [420, 430],
  [96, 260],
  [300, 470],
  [276, 58],
] as const;

function ServerBlock({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="112" height="72" rx="12" fill="rgba(14,24,20,0.85)" stroke="rgba(242,247,244,0.09)" />
      <rect x="0.5" y="0.5" width="111" height="71" rx="11.5" fill="none" stroke="url(#hv-edge)" />
      {[0, 1, 2].map((r) => (
        <g key={r} transform={`translate(12 ${14 + r * 16})`}>
          <rect width="88" height="10" rx="3" fill="rgba(242,247,244,0.035)" />
          <circle cx="7" cy="5" r="2" fill={r === 2 ? "#00C9A7" : "#00FF88"} opacity={r === 1 ? 0.5 : 1} />
          <rect x="16" y="4" width={r === 0 ? 40 : r === 1 ? 28 : 46} height="2" rx="1" fill="rgba(242,247,244,0.16)" />
        </g>
      ))}
      <text x="0" y="90" fill="#5f6d67" fontSize="10" fontFamily="var(--font-mono)">
        {label}
      </text>
    </g>
  );
}

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-[560/520] w-full max-w-[560px]">
      <svg viewBox="0 0 560 520" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <linearGradient id="hv-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00FF88" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#00FF88" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hv-link" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00C9A7" stopOpacity="0.2" />
            <stop offset="1" stopColor="#00FF88" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="hv-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#00FF88" stopOpacity="0.22" />
            <stop offset="1" stopColor="#00FF88" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hv-mark" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#00FF88" />
            <stop offset="1" stopColor="#00C9A7" />
          </linearGradient>
          <pattern id="hv-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(0,255,136,0.12)" />
          </pattern>
          <radialGradient id="hv-fade" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.4" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hv-mask">
            <rect width="560" height="520" fill="url(#hv-fade)" />
          </mask>
        </defs>

        {/* dotted holographic floor */}
        <rect width="560" height="520" fill="url(#hv-dots)" mask="url(#hv-mask)" />

        {/* orbit rings */}
        <circle cx="280" cy="260" r="150" fill="none" stroke="rgba(242,247,244,0.05)" />
        <circle cx="280" cy="260" r="110" fill="none" stroke="rgba(0,255,136,0.12)" strokeDasharray="2 6" />
        <circle cx="280" cy="260" r="72" fill="url(#hv-core)" />
        <g className="origin-[280px_260px]" style={{ animation: reduce ? undefined : "orbit 24s linear infinite" }}>
          <path d="M280 110 A150 150 0 0 1 418 200" fill="none" stroke="#00FF88" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="418" cy="200" r="2.5" fill="#00FF88" />
        </g>
        <g className="origin-[280px_260px]" style={{ animation: reduce ? undefined : "orbit 36s linear infinite reverse" }}>
          <path d="M170 260 A110 110 0 0 1 200 184" fill="none" stroke="#00C9A7" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* links */}
        {links.map((l) => (
          <g key={l.id}>
            <path id={`hv-path-${l.id}`} d={l.d} fill="none" stroke="rgba(242,247,244,0.07)" strokeWidth="1" />
            <path
              d={l.d}
              fill="none"
              stroke="url(#hv-link)"
              strokeWidth="1.2"
              strokeDasharray="3 9"
              className={reduce ? undefined : "animate-dash"}
            />
            {!reduce && (
              <circle r="2.6" fill="#00FF88" style={{ filter: "drop-shadow(0 0 4px #00FF88)" }}>
                <animateMotion dur={l.dur} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#hv-path-${l.id}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        ))}

        {/* small nodes */}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="7" fill="rgba(0,255,136,0.06)" stroke="rgba(0,255,136,0.25)" />
            <circle cx={x} cy={y} r="2" fill={i % 2 ? "#00C9A7" : "#00FF88"} />
          </g>
        ))}
        <path d="M96 260 H 160" stroke="rgba(242,247,244,0.07)" strokeDasharray="2 5" />

        <ServerBlock x={38} y={82} label="edge-fra-01" />
        <ServerBlock x={412} y={226} label="db-ams-02" />
        <ServerBlock x={60} y={374} label="app-nyc-03" />

        {/* core */}
        <g transform="translate(232 212)">
          <rect width="96" height="96" rx="26" fill="rgba(10,18,15,0.92)" stroke="rgba(0,255,136,0.35)" />
          <rect x="6" y="6" width="84" height="84" rx="21" fill="none" stroke="rgba(242,247,244,0.05)" />
          <g transform="translate(16 16) scale(2)">
            <path d="M9 8v9a7 7 0 0 0 7 7" stroke="url(#hv-mark)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M23 24v-9a7 7 0 0 0-7-7" stroke="url(#hv-mark)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <rect x="13.6" y="13.6" width="4.8" height="4.8" rx="1" transform="rotate(45 16 16)" fill="#00FF88" />
          </g>
        </g>

        {/* scan line */}
        {!reduce && (
          <rect x="232" y="212" width="96" height="2" rx="1" fill="#00FF88" opacity="0.35">
            <animate attributeName="y" values="216;304;216" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.45;0" dur="2.5s" repeatCount="indefinite" />
          </rect>
        )}
      </svg>

      {/* floating chips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="glass absolute right-[2%] top-[4%] hidden items-center gap-2.5 rounded-xl px-3 py-2 sm:flex"
      >
        <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Lock className="size-3.5" />
        </span>
        <span className="leading-tight">
          <span className="block text-[12px] font-medium text-fg">Encrypted tunnel</span>
          <span className="block font-mono text-[10.5px] text-muted">TLS 1.3 · AES-256-GCM</span>
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="glass absolute bottom-[3%] right-[4%] w-[188px] rounded-2xl p-3.5 sm:w-[210px]"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden />
            Threats blocked
          </span>
          <span className="font-mono text-[10.5px] text-primary">+4.2%</span>
        </div>
        <p className="mt-1 text-xl font-semibold tracking-tight text-fg" style={{ fontVariantNumeric: "tabular-nums" }}>
          12,481
        </p>
        <Sparkline data={[12, 18, 14, 22, 19, 28, 24, 31, 27, 36, 33, 41]} height={30} className="mt-2" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="glass absolute left-[1%] top-[44%] hidden items-center gap-2 rounded-full py-1.5 pl-2 pr-3 sm:flex"
      >
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
          <span className="relative size-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-[11px] text-fg-2">18 ms · healthy</span>
      </motion.div>
    </div>
  );
}
