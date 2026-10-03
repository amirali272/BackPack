"use client";

import { CircleAlert, Play, Plus, Power, RotateCcw, Search, ServerOff, Square } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select, inputClass } from "@/components/ui/Field";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import type { Server, ServerStatus } from "@/lib/dashboard-data";
import { maskIp } from "@/lib/format";
import { useDisclosure } from "@/lib/hooks";
import { useDashboard } from "../store";
import { ViewHeader, tableClass, tdClass, thClass } from "../widgets";

export function serverStatusBadge(status: ServerStatus) {
  switch (status) {
    case "online":
      return <Badge tone="success" dot>Online</Badge>;
    case "degraded":
      return <Badge tone="warn" dot>Degraded</Badge>;
    case "provisioning":
      return <Badge tone="info" dot pulse>Provisioning</Badge>;
    case "unreachable":
      return <Badge tone="danger" dot>Unreachable</Badge>;
    default:
      return <Badge tone="neutral" dot>Stopped</Badge>;
  }
}

type Filter = "all" | "running" | "issues";
type PendingAction = { server: Server; kind: "restart" | "stop" | "start" };

const regions = ["Frankfurt", "Amsterdam", "London", "New York", "Singapore"];
const plans = ["Standard 2 vCPU", "Pro 4 vCPU", "Pro 8 vCPU", "Memory 16 GB"];

function UsageCell({ value, active }: { value: number; active: boolean }) {
  if (!active) return <span className="text-subtle">—</span>;
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-1 w-14 overflow-hidden rounded-full bg-white/[0.07]">
        <span
          className={cn("block h-full rounded-full", value > 70 ? "bg-warn" : "bg-primary")}
          style={{ width: `${value}%` }}
        />
      </span>
      <span className={cn("font-mono text-[12px]", value > 70 ? "text-warn" : "text-fg-2")}>{value}%</span>
    </div>
  );
}

export function Servers() {
  const toast = useToast();
  const [servers, setServers] = useDashboard().servers;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const confirm = useDisclosure<PendingAction>();
  const pending = confirm.data;
  const [retrying, setRetrying] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", region: regions[0], plan: plans[0] });
  const [formError, setFormError] = useState<string>();
  const [creating, setCreating] = useState(false);

  const visible = useMemo(() => {
    return servers.filter((s) => {
      if (filter === "running" && !["online", "degraded", "provisioning"].includes(s.status)) return false;
      if (filter === "issues" && !["degraded", "unreachable", "offline"].includes(s.status)) return false;
      const q = query.trim().toLowerCase();
      return !q || s.name.includes(q) || s.region.toLowerCase().includes(q);
    });
  }, [servers, filter, query]);

  const update = (id: string, patch: Partial<Server>) =>
    setServers((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  async function runAction() {
    if (!pending) return;
    const { server, kind } = pending;
    await new Promise((r) => setTimeout(r, 900));
    if (kind === "stop") {
      update(server.id, { status: "offline", cpu: 0, ram: 0, uptime: "—" });
      toast({ title: `${server.name} stopped`, description: "The instance is powered off. Storage is retained.", tone: "info" });
    } else {
      update(server.id, { status: "online", cpu: 12, ram: 30, uptime: "0d 0h" });
      toast({
        title: kind === "restart" ? `${server.name} restarted` : `${server.name} started`,
        description: "Health checks are passing.",
      });
    }
  }

  async function retry(server: Server) {
    setRetrying(server.id);
    await new Promise((r) => setTimeout(r, 1300));
    setRetrying(null);
    update(server.id, { status: "online", cpu: 9, ram: 22, uptime: "0d 0h" });
    toast({ title: "Connection restored", description: `${server.name} is reachable again.` });
  }

  async function createServer(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{2,30}$/.test(name)) {
      setFormError("Use 3–31 lowercase letters, numbers or hyphens.");
      return;
    }
    if (servers.some((s) => s.name === name)) {
      setFormError("A server with this name already exists.");
      return;
    }
    setCreating(true);
    await new Promise((r) => setTimeout(r, 900));
    const id = `srv-${Date.now()}`;
    setServers((list) => [
      { id, name, region: form.region, plan: form.plan, ip: "192.0.2.1", os: "Debian 13", status: "provisioning", cpu: 0, ram: 0, disk: 2, uptime: "—" },
      ...list,
    ]);
    setCreating(false);
    setAddOpen(false);
    setForm({ name: "", region: regions[0], plan: plans[0] });
    toast({ title: "Server is provisioning", description: `${name} will be ready in about 40 seconds.`, tone: "info" });
    setTimeout(() => {
      update(id, { status: "online", cpu: 6, ram: 18, uptime: "0d 0h" });
      toast({ title: `${name} is online`, description: "SSH keys and firewall defaults applied." });
    }, 4000);
  }

  function actions(s: Server) {
    if (s.status === "unreachable") {
      return (
        <Button size="sm" variant="secondary" loading={retrying === s.id} onClick={() => retry(s)} iconLeft={<RotateCcw className="size-3.5" />}>
          Retry
        </Button>
      );
    }
    if (s.status === "provisioning") return <span className="text-[12px] text-muted">Setting up…</span>;
    if (s.status === "offline") {
      return (
        <Button size="sm" variant="secondary" onClick={() => confirm.show({ server: s, kind: "start" })} iconLeft={<Play className="size-3.5" />}>
          Start
        </Button>
      );
    }
    return (
      <div className="flex justify-end gap-1.5">
        <Button size="sm" variant="ghost" onClick={() => confirm.show({ server: s, kind: "restart" })} aria-label={`Restart ${s.name}`}>
          <RotateCcw className="size-3.5" />
          <span className="hidden xl:inline">Restart</span>
        </Button>
        <Button size="sm" variant="ghost" onClick={() => confirm.show({ server: s, kind: "stop" })} aria-label={`Stop ${s.name}`}>
          <Square className="size-3.5" />
          <span className="hidden xl:inline">Stop</span>
        </Button>
      </div>
    );
  }

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: servers.length },
    { id: "running", label: "Running", count: servers.filter((s) => ["online", "degraded", "provisioning"].includes(s.status)).length },
    { id: "issues", label: "Needs attention", count: servers.filter((s) => ["degraded", "unreachable", "offline"].includes(s.status)).length },
  ];

  return (
    <div>
      <ViewHeader
        title="Servers"
        description="Provision, monitor and control every instance in your workspace."
        actions={
          <Button onClick={() => setAddOpen(true)} iconLeft={<Plus className="size-4" />}>
            New server
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter servers" className="flex gap-1 rounded-xl border border-line-soft bg-white/[0.02] p-1">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                filter === f.id ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg",
              )}
            >
              {f.label}
              <span className="font-mono text-[11px] text-subtle">{f.count}</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <label htmlFor="server-search" className="sr-only">
            Search servers
          </label>
          <input
            id="server-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or region"
            className={cn(inputClass, "h-10 pl-9")}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {visible.length === 0 ? (
          <EmptyState
            icon={<ServerOff className="size-5" />}
            title="No servers match"
            description={query ? `Nothing matches “${query}” in this view.` : "There is nothing in this view right now."}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            {/* table ≥ md */}
            <div className="hidden overflow-x-auto md:block">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Server</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>CPU</th>
                    <th className={thClass}>RAM</th>
                    <th className={cn(thClass, "hidden lg:table-cell")}>Uptime</th>
                    <th className={cn(thClass, "text-right")}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => (
                    <tr key={s.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className={tdClass}>
                        <p className="font-mono text-[13px] text-fg">{s.name}</p>
                        <p className="mt-0.5 text-[12px] text-muted">
                          {s.region} · {maskIp(s.ip)} · {s.plan}
                        </p>
                        {s.status === "unreachable" && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#ff8a94]">
                            <CircleAlert className="size-3.5" aria-hidden /> Health check failed 3 times · last 2 min ago
                          </p>
                        )}
                      </td>
                      <td className={tdClass}>{serverStatusBadge(s.status)}</td>
                      <td className={tdClass}>
                        <UsageCell value={s.cpu} active={s.cpu > 0} />
                      </td>
                      <td className={tdClass}>
                        <UsageCell value={s.ram} active={s.ram > 0} />
                      </td>
                      <td className={cn(tdClass, "hidden font-mono text-[12px] lg:table-cell")}>{s.uptime}</td>
                      <td className={cn(tdClass, "text-right")}>{actions(s)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* cards < md */}
            <ul className="divide-y divide-line-soft md:hidden">
              {visible.map((s) => (
                <li key={s.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[13px] text-fg">{s.name}</p>
                      <p className="mt-0.5 text-[12px] text-muted">
                        {s.region} · {maskIp(s.ip)}
                      </p>
                    </div>
                    {serverStatusBadge(s.status)}
                  </div>
                  {s.status === "unreachable" && (
                    <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#ff8a94]">
                      <CircleAlert className="size-3.5" aria-hidden /> Health check failed
                    </p>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="mb-1 text-[11px] text-subtle">CPU</p>
                      <UsageCell value={s.cpu} active={s.cpu > 0} />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-subtle">RAM</p>
                      <UsageCell value={s.ram} active={s.ram > 0} />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">{actions(s)}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={confirm.open}
        onClose={confirm.close}
        onConfirm={runAction}
        tone={pending?.kind === "stop" ? "danger" : "primary"}
        icon={pending?.kind === "stop" ? <Power className="size-5" /> : <RotateCcw className="size-5" />}
        title={
          pending?.kind === "stop"
            ? `Stop ${pending.server.name}?`
            : pending?.kind === "start"
              ? `Start ${pending?.server.name}?`
              : `Restart ${pending?.server.name}?`
        }
        description={
          pending?.kind === "stop"
            ? "Running services will go offline until you start the server again. Disks and IP addresses are kept."
            : pending?.kind === "start"
              ? "The server will boot and rejoin its load balancer once health checks pass."
              : "Active connections will drop for roughly 20 seconds while the server reboots."
        }
        confirmLabel={pending?.kind === "stop" ? "Stop server" : pending?.kind === "start" ? "Start server" : "Restart now"}
      />

      <Modal
        open={addOpen}
        onClose={() => !creating && setAddOpen(false)}
        busy={creating}
        title="Create a server"
        description="It boots from a hardened image with SSH keys, firewall defaults and monitoring already on."
        size="md"
      >
        <form onSubmit={createServer} className="grid gap-4" noValidate>
          <Input
            label="Server name"
            placeholder="api-fra-02"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setFormError(undefined);
            }}
            error={formError}
            hint="Lowercase letters, numbers and hyphens."
            autoComplete="off"
            data-autofocus
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
            <Select label="Plan" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
              {plans.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </div>
          <div className="mt-3 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setAddOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create server
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
