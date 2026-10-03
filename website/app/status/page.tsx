import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/SiteLayout";
import { StatusSubscribe } from "@/components/StatusSubscribe";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Status", description: "Live and historical status for Unknown Host services." };

type Day = "ok" | "minor" | "major";

/** Deterministic 90-day history: a few short incidents, mostly green. */
function history(seed: number, incidents: Record<number, Day>): Day[] {
  return Array.from({ length: 90 }, (_, i) => incidents[(i + seed) % 90] ?? "ok");
}

const components = [
  { name: "Dashboard", uptime: "100%", days: history(0, {}) },
  { name: "REST API", uptime: "99.99%", days: history(0, { 61: "minor" }) },
  { name: "Edge network", uptime: "99.98%", days: history(0, { 22: "minor", 74: "minor" }) },
  { name: "DNS", uptime: "100%", days: history(0, {}) },
  { name: "Telegram bot", uptime: "99.95%", days: history(0, { 40: "major" }) },
  { name: "Backups", uptime: "100%", days: history(0, {}) },
];

const regions = [
  { name: "Frankfurt", latency: "12 ms" },
  { name: "Amsterdam", latency: "14 ms" },
  { name: "London", latency: "16 ms" },
  { name: "New York", latency: "19 ms" },
  { name: "Singapore", latency: "22 ms" },
  { name: "São Paulo", latency: "27 ms" },
];

const incidents = [
  {
    date: "Aug 24, 2026",
    title: "Delayed Telegram notifications",
    impact: "major",
    body: "Alerts were delayed by up to 9 minutes due to an upstream rate limit. Delivery was moved to a dedicated queue and all delayed alerts were sent.",
    duration: "38 min",
  },
  {
    date: "Jul 13, 2026",
    title: "Elevated API latency in New York",
    impact: "minor",
    body: "A noisy neighbour on one hypervisor increased p95 latency. Affected workloads were live-migrated.",
    duration: "21 min",
  },
];

const dayColor: Record<Day, string> = { ok: "bg-primary/60", minor: "bg-warn", major: "bg-danger" };

export default function StatusPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <Eyebrow>System status</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">Status</h1>

        <Card className="mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl border border-primary/30 bg-primary/[0.08] text-primary shadow-[0_0_30px_-8px_rgba(0,255,136,0.6)]">
              <CircleCheck className="size-6" aria-hidden />
            </span>
            <div>
              <p className="text-lg font-semibold text-fg">All systems operational</p>
              <p className="text-[13px] text-muted">Updated every 60 seconds</p>
            </div>
          </div>
          <StatusSubscribe />
        </Card>

        <Card className="mt-6 p-2 sm:p-3">
          <ul>
            {components.map((c) => (
              <li key={c.name} className="rounded-xl px-3 py-4 sm:px-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14.5px] font-medium text-fg">{c.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] text-muted">{c.uptime}</span>
                    <Badge tone="success" dot>
                      Operational
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex h-8 gap-px sm:gap-[2px]" role="img" aria-label={`${c.name}: ${c.uptime} uptime over 90 days`}>
                  {c.days.map((d, i) => (
                    <span
                      key={i}
                      className={cn("flex-1 rounded-[2px] transition-opacity hover:opacity-70", dayColor[d], i < 30 && "hidden sm:block")}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[10.5px] text-subtle" aria-hidden>
                  <span>
                    <span className="hidden sm:inline">90</span>
                    <span className="sm:hidden">60</span> days ago
                  </span>
                  <span>Today</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <h2 className="mt-14 text-xl font-semibold text-fg">Regions</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <li key={r.name} className="glass flex items-center justify-between rounded-2xl px-4 py-3.5">
              <span className="flex items-center gap-2.5 text-[14px] text-fg">
                <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,136,0.8)]" aria-hidden />
                {r.name}
              </span>
              <span className="font-mono text-[12px] text-muted">{r.latency}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-xl font-semibold text-fg">Past incidents</h2>
        <ol className="mt-5 space-y-3">
          {incidents.map((i) => (
            <li key={i.title}>
              <Card className="p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Badge tone={i.impact === "major" ? "danger" : "warn"}>{i.impact === "major" ? "Major" : "Minor"}</Badge>
                  <p className="text-[14.5px] font-medium text-fg">{i.title}</p>
                  <Badge tone="success" className="ml-auto">
                    Resolved · {i.duration}
                  </Badge>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{i.body}</p>
                <p className="mt-2 font-mono text-[12px] text-subtle">{i.date}</p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </SiteLayout>
  );
}
