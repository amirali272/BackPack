"use client";

import { MessageSquare, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { BarChart } from "@/components/charts";
import { LogoMark } from "@/components/Logo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import { botActivity24 } from "@/lib/dashboard-data";
import { SecretField } from "../SecretField";
import { useDashboard } from "../store";
import { Panel, ViewHeader } from "../widgets";

const chats = [
  { name: "Ops team", type: "Group · 6 members", alerts: "All alerts" },
  { name: "Alex Morgan", type: "Private chat", alerts: "Critical only" },
  { name: "#incidents", type: "Channel · read-only", alerts: "Security alerts" },
];

const routing = [
  { id: "security", label: "Security alerts", detail: "Failed logins, blocked attacks, new devices" },
  { id: "resources", label: "Resource warnings", detail: "CPU, RAM or disk above 80% for 10 min" },
  { id: "backups", label: "Backup notifications", detail: "Completed, failed or skipped backups" },
  { id: "reports", label: "Daily report", detail: "Sent every day at 09:00 UTC" },
];

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[b % 62]).join("");
  return `7429183056:AA${body}`;
}

export function BotsView() {
  const toast = useToast();
  const [commands, setCommands] = useDashboard().commands;
  const [token, setToken] = useState("7429183056:AAH4k2xQ9mZr7Lw1pN8cVt3bY6sJd0FgE5u");
  const [rotateOpen, setRotateOpen] = useState(false);
  const [routes, setRoutes] = useState<Record<string, boolean>>({ security: true, resources: true, backups: true, reports: false });

  return (
    <div className="grid gap-4 lg:gap-5">
      <ViewHeader title="Telegram Bots" description="Connect bots, choose what they can do and where alerts are delivered." />

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <LogoMark size={52} />
            <div>
              <p className="flex flex-wrap items-center gap-2 text-[16px] font-semibold text-fg">
                @unknownhost_ops_bot <Badge tone="success" dot pulse>Connected</Badge>
              </p>
              <p className="mt-1 text-[13px] text-muted">Linked Sep 14, 2026 · webhook healthy · 38 ms avg. response</p>
            </div>
          </div>
          <div className="flex-1 lg:max-w-md lg:ml-auto">
            <p className="mb-1.5 text-[12px] text-muted">Bot token</p>
            <div className="flex items-center gap-2">
              <SecretField label="bot token" secret={token} className="flex-1" />
              <Button size="sm" variant="secondary" onClick={() => setRotateOpen(true)} iconLeft={<RefreshCw className="size-3.5" />}>
                Rotate
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        <Panel title="Bot activity" description="Commands handled per hour, last 24h" className="xl:col-span-2">
          <BarChart data={botActivity24} height={160} color="#00C9A7" ariaLabel="Bot commands per hour over the last 24 hours" highlight={18} />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line-soft pt-4">
            {[
              { label: "Commands", value: "2,341" },
              { label: "Alerts sent", value: "118" },
              { label: "Avg. response", value: "38 ms" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[12px] text-muted">{s.label}</p>
                <p className="mt-1 text-lg font-semibold text-fg">{s.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Connected chats" description="Where this bot can talk">
          <ul className="space-y-2">
            {chats.map((c) => (
              <li key={c.name} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.015] p-3">
                <span className="grid size-9 place-items-center rounded-lg bg-secondary/10 text-secondary">
                  {c.type.startsWith("Group") ? <Users className="size-4" aria-hidden /> : <MessageSquare className="size-4" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-fg">{c.name}</p>
                  <p className="text-[12px] text-muted">{c.type}</p>
                </div>
                <span className="hidden font-mono text-[11px] text-subtle sm:inline">{c.alerts}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
        <Panel title="Commands" description="Disabled commands reply with “not allowed”. Role checks always apply.">
          <ul className="divide-y divide-line-soft">
            {commands.map((c) => (
              <li key={c.cmd} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <code className="font-mono text-[13px] text-primary">{c.cmd}</code>
                    {c.confirm && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <ShieldCheck className="size-3" aria-hidden /> asks to confirm
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-muted">{c.description}</p>
                </div>
                <Switch
                  label={`${c.cmd} command`}
                  checked={c.enabled}
                  onChange={(next) => {
                    setCommands((list) => list.map((x) => (x.cmd === c.cmd ? { ...x, enabled: next } : x)));
                    toast({ title: `${c.cmd} ${next ? "enabled" : "disabled"}`, tone: next ? "success" : "info" });
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Alert routing" description="Choose what the bot sends without being asked">
          <ul className="divide-y divide-line-soft">
            {routing.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-[13.5px] text-fg">{r.label}</p>
                  <p className="mt-0.5 text-[12.5px] text-muted">{r.detail}</p>
                </div>
                <Switch
                  label={r.label}
                  checked={routes[r.id]}
                  onChange={(next) => {
                    setRoutes((x) => ({ ...x, [r.id]: next }));
                    toast({ title: `${r.label} ${next ? "on" : "off"}`, tone: "info" });
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <ConfirmDialog
        open={rotateOpen}
        onClose={() => setRotateOpen(false)}
        tone="danger"
        icon={<RefreshCw className="size-5" />}
        title="Rotate bot token?"
        description="The current token stops working immediately. Anything else using it — scripts or other servers — will need the new one."
        confirmLabel="Rotate token"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 900));
          setToken(randomToken());
          toast({ title: "Token rotated", description: "The webhook was re-registered with the new token." });
        }}
      />
    </div>
  );
}
