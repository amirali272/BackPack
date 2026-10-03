"use client";

import { ArrowUpRight, Bot, Clock, Network, ShieldAlert, Users } from "lucide-react";
import { AreaChart, BarChart, Meter, RadialGauge, Sparkline } from "@/components/charts";
import { Badge } from "@/components/ui/Badge";
import { Counter } from "@/components/ui/Counter";
import { cn } from "@/lib/cn";
import * as data from "@/lib/dashboard-data";
import { useOptionalDashboard } from "../store";
import { Panel, StatTile } from "../widgets";
import { serverStatusBadge } from "./Servers";

/** 30 daily uptime bars; one day had a short partial outage. */
function UptimeStrip() {
  return (
    <div className="flex h-8 items-end gap-[2px]" role="img" aria-label="Uptime for each of the last 30 days: 29 days at 100%, one day at 99.7%">
      {Array.from({ length: 30 }, (_, i) => (
        <span
          key={i}
          className={cn("h-full flex-1 rounded-[2px]", i === 17 ? "bg-warn/80" : "bg-primary/55")}
        />
      ))}
    </div>
  );
}

export function Overview({ compact = false }: { compact?: boolean }) {
  const store = useOptionalDashboard();
  const servers = store?.servers[0] ?? data.servers;
  const navigate = store?.navigate;

  const linkButton = (label: string, view: Parameters<NonNullable<typeof navigate>>[0]) =>
    navigate ? (
      <button
        type="button"
        onClick={() => navigate(view)}
        className="inline-flex items-center gap-1 rounded-md text-[12.5px] text-muted transition-colors hover:text-primary"
      >
        {label} <ArrowUpRight className="size-3.5" aria-hidden />
      </button>
    ) : null;

  return (
    <div className="grid gap-4 lg:gap-5">
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4 lg:gap-5">
        <StatTile label="Server uptime" value={<Counter value={99.99} decimals={2} suffix="%" />} delta="30d" deltaTone="neutral" icon={<Clock className="size-3.5" />}>
          <UptimeStrip />
        </StatTile>
        <StatTile label="Active users" value={<Counter value={1284} />} delta="+8.1%" icon={<Users className="size-3.5" />}>
          <Sparkline data={data.usersSpark} height={32} color="#00C9A7" />
        </StatTile>
        <StatTile label="Security events · 24h" value={<Counter value={37} />} delta="−12%" icon={<ShieldAlert className="size-3.5" />}>
          <BarChart data={data.securityEvents7d} height={32} ariaLabel="Security events over the last 7 days" color="#00FF88" />
        </StatTile>
        <StatTile label="Bot activity · 24h" value={<Counter value={2341} />} delta="+22%" icon={<Bot className="size-3.5" />}>
          <BarChart data={data.botActivity24.slice(7, 19)} height={32} ariaLabel="Bot commands per hour during the working day" color="#00C9A7" />
        </StatTile>
      </div>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        <Panel
          title="Network traffic"
          description="Inbound and outbound across all regions"
          className="xl:col-span-2"
          action={
            <div className="hidden items-center gap-4 text-[12px] text-muted sm:flex">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" aria-hidden /> In
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-secondary" aria-hidden /> Out
              </span>
            </div>
          }
        >
          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold tracking-tight text-fg">3.4 Gbps</span>
            <span className="flex items-center gap-1.5 text-[12px] text-muted">
              <Network className="size-3.5 text-primary" aria-hidden /> peak at 18:00
            </span>
          </div>
          <AreaChart
            ariaLabel="Network traffic in and out over the last 24 hours, peaking at 3.4 gigabits per second"
            labels={data.hours24}
            height={compact ? 150 : 200}
            unit=" Gbps"
            series={[
              { label: "In", data: data.trafficIn, color: "#00FF88" },
              { label: "Out", data: data.trafficOut, color: "#00C9A7" },
            ]}
          />
        </Panel>

        <Panel title="Resources" description="Fleet average, last 5 minutes" action={linkButton("Servers", "servers")}>
          <div className="flex items-center justify-around gap-2">
            <RadialGauge value={32} label="CPU" sublabel="%" size={compact ? 104 : 116} />
            <RadialGauge value={48} label="RAM" sublabel="%" size={compact ? 104 : 116} color="#00C9A7" />
          </div>
          <div className="mt-6 space-y-4">
            <Meter label="Disk" value={44} tone="secondary" />
            <Meter label="Bandwidth quota" value={61} />
          </div>
        </Panel>
      </div>

      {!compact && (
        <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
          <Panel title="Security events" description="Blocked or flagged, last 7 days" action={linkButton("Security", "security")}>
            <BarChart
              data={data.securityEvents7d}
              labels={data.days7}
              height={150}
              ariaLabel="Security events per day for the last 7 days"
              highlight={2}
            />
          </Panel>

          <Panel title="Bot activity" description="Commands handled per hour" action={linkButton("Bots", "bots")}>
            <BarChart
              data={data.botActivity24}
              height={150}
              color="#00C9A7"
              ariaLabel="Telegram bot commands per hour over the last 24 hours"
              highlight={18}
            />
            <div className="mt-2.5 flex justify-between font-mono text-[10px] text-subtle" aria-hidden>
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </Panel>

          <Panel title="Servers" description={`${servers.length} in 5 regions`} action={linkButton("Manage", "servers")} bodyClassName="-mx-2">
            <ul className="space-y-0.5">
              {servers.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[12.5px] text-fg">{s.name}</p>
                    <p className="text-[11.5px] text-muted">{s.region}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("hidden font-mono text-[11.5px] sm:inline", s.cpu > 70 ? "text-warn" : "text-muted")}>
                      {s.cpu ? `${s.cpu}%` : "—"}
                    </span>
                    {serverStatusBadge(s.status)}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {!compact && (
        <Panel title="Recent activity" description="Latest entries from the audit log" action={linkButton("All logs", "logs")}>
          <ol className="relative space-y-4 before:absolute before:inset-y-1 before:left-[5px] before:w-px before:bg-line-soft">
            {data.auditLogs.slice(0, 5).map((log) => (
              <li key={log.id} className="relative flex items-start gap-4 pl-6">
                <span
                  className={cn(
                    "absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-bg",
                    log.level === "critical" ? "bg-danger" : log.level === "warning" ? "bg-warn" : "bg-primary",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-fg">
                    <span className="font-mono text-primary/90">{log.action}</span>
                    <span className="text-muted"> · {log.target}</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">by {log.actor}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {log.level === "critical" && <Badge tone="danger">Critical</Badge>}
                  <time className="font-mono text-[11.5px] text-subtle">{log.time}</time>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </div>
  );
}
