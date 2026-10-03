"use client";

import { Download, RotateCcw, ScrollText, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { inputClass } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { auditLogs, type AuditLevel, type AuditLog } from "@/lib/dashboard-data";
import { maskIp } from "@/lib/format";
import { ViewHeader, tableClass, tdClass, thClass } from "../widgets";

const levelBadge: Record<AuditLevel, React.ReactNode> = {
  info: <Badge tone="info">Info</Badge>,
  warning: <Badge tone="warn">Warning</Badge>,
  critical: <Badge tone="danger">Critical</Badge>,
};

const older: AuditLog[] = [
  { id: "o1", time: "05:41:18", actor: "system", action: "backup.completed", target: "db-ams-02", ip: "internal", level: "info" },
  { id: "o2", time: "04:12:09", actor: "system", action: "waf.rule_triggered", target: "SQLi · /api/v2/search", ip: "192.0.2.230", level: "warning" },
  { id: "o3", time: "03:14:55", actor: "system", action: "auth.ip_banned", target: "SSH brute force", ip: "192.0.2.230", level: "critical" },
];

export function LogsView() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"all" | AuditLevel>("all");
  const [rows, setRows] = useState(auditLogs);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [attempts, setAttempts] = useState(0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (level === "all" || r.level === level) &&
        (!q || [r.actor, r.action, r.target].some((v) => v.toLowerCase().includes(q))),
    );
  }, [rows, query, level]);

  async function loadOlder() {
    setLoadState("loading");
    await new Promise((r) => setTimeout(r, 1100));
    // The first attempt fails on purpose to demonstrate the error state.
    if (attempts === 0) {
      setAttempts(1);
      setLoadState("error");
      return;
    }
    setRows((r) => [...r, ...older]);
    setLoadState("done");
  }

  return (
    <div>
      <ViewHeader
        title="Audit logs"
        description="Every sign-in, configuration change and automated action, kept for 365 days."
        actions={
          <Button
            variant="secondary"
            iconLeft={<Download className="size-4" />}
            onClick={() => toast({ title: "Export started", description: "We’ll email a signed CSV to alex@acme.dev.", tone: "info" })}
          >
            Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <label htmlFor="log-search" className="sr-only">
            Search logs
          </label>
          <input
            id="log-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, action or target"
            className={cn(inputClass, "h-10 pl-9")}
          />
        </div>
        <div role="tablist" aria-label="Filter by level" className="flex gap-1 rounded-xl border border-line-soft bg-white/[0.02] p-1">
          {(["all", "info", "warning", "critical"] as const).map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={level === l}
              onClick={() => setLevel(l)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition-colors",
                level === l ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {visible.length === 0 ? (
          <EmptyState
            icon={<ScrollText className="size-5" />}
            title="No log entries found"
            description="Try a different search term or level. Logs are retained for 365 days."
            action={
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setLevel("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>Time (UTC)</th>
                  <th className={thClass}>Level</th>
                  <th className={thClass}>Action</th>
                  <th className={thClass}>Actor</th>
                  <th className={thClass}>Source IP</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className={cn(tdClass, "font-mono text-[12px] text-muted")}>{r.time}</td>
                    <td className={tdClass}>{levelBadge[r.level]}</td>
                    <td className={tdClass}>
                      <p className="font-mono text-[12.5px] text-fg">{r.action}</p>
                      <p className="mt-0.5 text-[12px] text-muted">{r.target}</p>
                    </td>
                    <td className={cn(tdClass, "text-[12.5px]")}>{r.actor}</td>
                    <td className={cn(tdClass, "font-mono text-[12px]")}>{r.ip === "internal" ? "internal" : maskIp(r.ip)}</td>
                  </tr>
                ))}
                {loadState === "loading" &&
                  [0, 1, 2].map((i) => (
                    <tr key={`sk-${i}`} aria-hidden>
                      {["w-16", "w-14", "w-40", "w-24", "w-20"].map((w) => (
                        <td key={w} className={tdClass}>
                          <Skeleton className={cn("h-3", w)} />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {visible.length > 0 && (
          <div className="border-t border-line-soft p-4">
            {loadState === "error" ? (
              <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-danger/25 bg-danger/[0.05] p-4 text-center sm:flex-row sm:text-left">
                <TriangleAlert className="size-5 shrink-0 text-danger" aria-hidden />
                <div className="flex-1">
                  <p className="text-[13.5px] font-medium text-fg">Couldn’t load older entries</p>
                  <p className="text-[12.5px] text-muted">The log service timed out. Your filters are kept.</p>
                </div>
                <Button size="sm" variant="secondary" onClick={loadOlder} iconLeft={<RotateCcw className="size-3.5" />}>
                  Try again
                </Button>
              </div>
            ) : loadState === "done" ? (
              <p className="text-center text-[12.5px] text-muted">You’ve reached the start of today’s log.</p>
            ) : (
              <div className="flex justify-center">
                <Button size="sm" variant="ghost" onClick={loadOlder} loading={loadState === "loading"}>
                  Load older entries
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
