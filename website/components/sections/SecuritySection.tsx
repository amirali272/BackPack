"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Activity,
  BrickWall,
  Fingerprint,
  Gauge,
  LockKeyhole,
  Radar,
  Waves,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AreaChart } from "@/components/charts";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const features: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Waves, title: "DDoS Protection", text: "Volumetric and L7 floods absorbed at the edge." },
  { icon: BrickWall, title: "Firewall", text: "Stateful rules per server, network and region." },
  { icon: Gauge, title: "Rate Limiting", text: "Per-IP, per-key and per-route quotas." },
  { icon: Fingerprint, title: "Authentication", text: "SSO, passkeys and enforced 2FA." },
  { icon: LockKeyhole, title: "Encryption", text: "TLS 1.3 in transit, AES-256 at rest." },
  { icon: Activity, title: "Monitoring", text: "Every request and login, observable." },
  { icon: Radar, title: "Threat Detection", text: "Behavioural models flag anomalies early." },
  { icon: Waypoints, title: "Secure API Gateway", text: "Schema-validated, signed, metered." },
];

const metrics = [
  { label: "Uptime", value: 99.99, decimals: 2, suffix: "%", trend: "30-day" },
  { label: "Threats Blocked", value: 12481, trend: "+4.2% today" },
  { label: "Active Connections", value: 1284, trend: "live" },
  { label: "Security Score", value: 98, suffix: "/100", trend: "Excellent" },
];

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const allowed = [420, 380, 350, 330, 340, 390, 470, 560, 640, 700, 720, 760, 780, 770, 750, 740, 760, 790, 820, 780, 700, 610, 520, 460];
const blocked = [60, 48, 52, 40, 44, 70, 120, 96, 110, 140, 380, 260, 150, 132, 120, 128, 140, 150, 210, 160, 130, 110, 90, 70];

type FeedEvent = { id: number; tone: Tone; title: string; meta: string; region: string };

const pool: Omit<FeedEvent, "id">[] = [
  { tone: "danger", title: "SYN flood mitigated", meta: "198.51.•••.•• · 48k pps", region: "FRA" },
  { tone: "danger", title: "SQL injection blocked", meta: "POST /api/v2/login", region: "AMS" },
  { tone: "warn", title: "Rate limit enforced", meta: "key uh_live_••••7f2c · 1.2k rpm", region: "NYC" },
  { tone: "success", title: "New device verified", meta: "2FA · Berlin, DE", region: "FRA" },
  { tone: "info", title: "Certificate renewed", meta: "*.acme.dev · TLS 1.3", region: "GLB" },
  { tone: "warn", title: "Brute-force pattern", meta: "SSH · 23 attempts · auto-banned", region: "SIN" },
  { tone: "danger", title: "Bot traffic challenged", meta: "score 0.12 · /checkout", region: "LON" },
  { tone: "info", title: "Geo rule applied", meta: "rule #14 · 312 requests", region: "AMS" },
];

const ages = ["just now", "9s ago", "24s ago", "48s ago", "1m ago"];

function LiveFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [events, setEvents] = useState<FeedEvent[]>(() => pool.slice(0, 5).map((e, i) => ({ ...e, id: i })));
  const next = useRef(5);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => {
      const id = next.current++;
      setEvents((list) => [{ ...pool[id % pool.length], id }, ...list.slice(0, 4)]);
    }, 3200);
    return () => clearInterval(t);
  }, [inView, reduce]);

  return (
    <div ref={ref}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-medium text-fg">Live events</p>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-primary" aria-hidden />
          streaming
        </span>
      </div>
      <ul className="space-y-1.5" aria-live="off">
        <AnimatePresence initial={false}>
          {events.map((e, i) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.02] px-3 py-2.5">
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    e.tone === "danger" && "bg-danger",
                    e.tone === "warn" && "bg-warn",
                    e.tone === "success" && "bg-primary",
                    e.tone === "info" && "bg-secondary",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-fg">{e.title}</p>
                  <p className="truncate font-mono text-[11px] text-muted">{e.meta}</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="font-mono text-[11px] text-fg-2">{e.region}</p>
                  <p className="text-[11px] text-subtle">{ages[i]}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export function SecuritySection() {
  return (
    <section id="security" className="relative py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-[600px] bg-[radial-gradient(50%_50%_at_70%_50%,rgba(0,255,136,0.06),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Security"
          title={
            <>
              Defense in depth, <span className="text-gradient">on by default.</span>
            </>
          }
          description="Eight layers of protection sit between the internet and your workloads. You don't configure them to be safe — you configure them to be stricter."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <ul className="grid content-start gap-3 self-start sm:grid-cols-2 lg:sticky lg:top-28 lg:col-span-5 lg:grid-cols-1 xl:grid-cols-2">
            {features.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 0.04}>
                <div className="group flex h-full items-start gap-3.5 rounded-2xl border border-line-soft bg-white/[0.015] p-4 transition-[border-color,background-color] duration-300 hover:border-line hover:bg-primary/[0.03]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line-soft bg-white/[0.03] text-primary transition-shadow duration-300 group-hover:shadow-[0_0_18px_-4px_rgba(0,255,136,0.5)]">
                    <f.icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[14.5px] font-semibold text-fg">{f.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="glass edge rounded-3xl p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Security console</p>
                  <p className="mt-1.5 flex items-center gap-2.5 text-lg font-semibold text-fg">
                    System Status:
                    <span className="text-primary">Protected</span>
                  </p>
                </div>
                <Badge tone="success" dot pulse>
                  All layers active
                </Badge>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {metrics.map((m) => (
                  <div key={m.label} className="rounded-2xl border border-line-soft bg-white/[0.02] p-4">
                    <dt className="text-[12px] text-muted">{m.label}</dt>
                    <dd className="mt-1.5 text-[22px] font-semibold tracking-tight text-fg">
                      <Counter value={m.value} decimals={m.decimals} suffix={m.suffix} />
                    </dd>
                    <dd className="mt-1 font-mono text-[10.5px] text-primary/80">{m.trend}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-2xl border border-line-soft bg-[#060b09]/60 p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-medium text-fg">Requests · last 24h</p>
                  <div className="flex items-center gap-4 text-[12px] text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary" aria-hidden /> Allowed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-danger" aria-hidden /> Blocked
                    </span>
                  </div>
                </div>
                <AreaChart
                  ariaLabel="Allowed and blocked requests per hour over the last 24 hours"
                  labels={hours}
                  height={170}
                  unit="k"
                  series={[
                    { label: "Allowed", data: allowed, color: "#00FF88" },
                    { label: "Blocked", data: blocked, color: "#FF6370" },
                  ]}
                />
              </div>

              <div className="mt-6">
                <LiveFeed />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
