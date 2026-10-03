"use client";

import { Check, KeyRound, Laptop, LogOut, Monitor, ShieldCheck, Smartphone, Usb } from "lucide-react";
import { BarChart, RadialGauge } from "@/components/charts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { days7, loginHistory, securityEvents7d, type Device, type Session } from "@/lib/dashboard-data";
import { maskIp } from "@/lib/format";
import { useDisclosure } from "@/lib/hooks";
import { useDashboard } from "../store";
import { Panel, ViewHeader, tableClass, tdClass, thClass } from "../widgets";
import { useState } from "react";

const deviceIcon = { laptop: Laptop, phone: Smartphone, desktop: Monitor, key: Usb } as const;

export function SecurityStatusBanner() {
  return (
    <Card className="relative overflow-hidden p-5 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(0,255,136,0.12),transparent)]" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <RadialGauge value={98} label="Score" sublabel="/100" size={120} />
        <div className="flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">System status</p>
          <p className="mt-1 flex flex-wrap items-center gap-3 text-xl font-semibold text-fg">
            Protected <Badge tone="success" dot pulse>8 of 8 layers active</Badge>
          </p>
          <ul className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
            {["2FA enforced for all admins", "API keys rotated in the last 90 days", "TLS 1.3 on every endpoint", "Backups verified 6 h ago"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-fg-2">
                <Check className="size-4 text-primary" aria-hidden /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export function SecurityView() {
  const toast = useToast();
  const store = useDashboard();
  const [rules, setRules] = store.firewall;
  const [sessions, setSessions] = store.sessions;
  const [devices, setDevices] = store.devices;
  const revokeSession = useDisclosure<Session>();
  const removeDevice = useDisclosure<Device>();
  const [revokeAll, setRevokeAll] = useState(false);
  const [limits, setLimits] = useState({ perIp: "600", perKey: "1200" });
  const [limitErrors, setLimitErrors] = useState<{ perIp?: string; perKey?: string }>({});
  const [savingLimits, setSavingLimits] = useState(false);

  async function saveLimits(e: React.FormEvent) {
    e.preventDefault();
    const errors: typeof limitErrors = {};
    for (const key of ["perIp", "perKey"] as const) {
      const n = Number(limits[key]);
      if (!Number.isInteger(n) || n < 10 || n > 100000) errors[key] = "Enter a whole number between 10 and 100,000.";
    }
    setLimitErrors(errors);
    if (Object.keys(errors).length) return;
    setSavingLimits(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingLimits(false);
    toast({ title: "Rate limits updated", description: "New limits apply to the next request window." });
  }

  return (
    <div className="grid gap-4 lg:gap-5">
      <ViewHeader title="Security" description="Threat activity, firewall rules, rate limits and everything signed in to your account." />

      <SecurityStatusBanner />

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
        <Panel title="Threats blocked" description="Per day, last 7 days">
          <BarChart data={securityEvents7d.map((v) => v * 31)} labels={days7} height={160} ariaLabel="Threats blocked per day over the last 7 days" highlight={2} />
        </Panel>

        <Panel title="Firewall rules" description="Changes apply globally within seconds">
          <ul className="divide-y divide-line-soft">
            {rules.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-[13.5px] text-fg">{r.name}</p>
                  <p className="mt-0.5 text-[12px] text-muted">{r.detail}</p>
                </div>
                <Switch
                  label={r.name}
                  checked={r.enabled}
                  onChange={(next) => {
                    setRules((list) => list.map((x) => (x.id === r.id ? { ...x, enabled: next } : x)));
                    toast({ title: `${r.name} ${next ? "enabled" : "disabled"}`, tone: next ? "success" : "warning" });
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Rate limiting" description="Requests per minute before clients receive HTTP 429">
        <form onSubmit={saveLimits} className="grid items-start gap-4 sm:grid-cols-[1fr_1fr_auto]" noValidate>
          <Input
            label="Per IP address"
            inputMode="numeric"
            value={limits.perIp}
            onChange={(e) => setLimits({ ...limits, perIp: e.target.value })}
            error={limitErrors.perIp}
            hint="Recommended: 300–1,000"
          />
          <Input
            label="Per API key"
            inputMode="numeric"
            value={limits.perKey}
            onChange={(e) => setLimits({ ...limits, perKey: e.target.value })}
            error={limitErrors.perKey}
            hint="Recommended: 1,000–5,000"
          />
          <Button type="submit" loading={savingLimits} className="sm:mt-[26px]">
            Save limits
          </Button>
        </form>
      </Panel>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
        <Panel
          title="Active sessions"
          description="Browsers and apps signed in to your account"
          action={
            sessions.length > 1 && (
              <Button size="sm" variant="ghost" onClick={() => setRevokeAll(true)}>
                Sign out others
              </Button>
            )
          }
        >
          <ul className="space-y-2">
            {sessions.map((s) => {
              const Icon = deviceIcon[s.device];
              return (
                <li key={s.id} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.015] p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-fg-2">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[13px] text-fg">
                      <span className="truncate">{s.name}</span>
                      {s.current && <Badge tone="success">This device</Badge>}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-muted">
                      {s.location} · {maskIp(s.ip)} · {s.lastSeen}
                    </p>
                  </div>
                  {!s.current && (
                    <Button size="sm" variant="ghost" onClick={() => revokeSession.show(s)} aria-label={`Revoke session on ${s.name}`}>
                      <LogOut className="size-3.5" />
                      <span className="hidden sm:inline">Revoke</span>
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Trusted devices" description="Passkeys, security keys and authenticator apps">
          <ul className="space-y-2">
            {devices.map((d) => {
              const Icon = deviceIcon[d.type];
              return (
                <li key={d.id} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.015] p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/[0.07] text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-fg">{d.name}</p>
                    <p className="mt-0.5 text-[12px] text-muted">Added {d.added}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeDevice.show(d)}
                    disabled={devices.length === 1}
                    aria-label={`Remove ${d.name}`}
                  >
                    Remove
                  </Button>
                </li>
              );
            })}
          </ul>
          {devices.length === 1 && (
            <p className="mt-3 flex items-center gap-2 text-[12px] text-muted">
              <KeyRound className="size-3.5" aria-hidden /> Your last sign-in method can’t be removed.
            </p>
          )}
        </Panel>
      </div>

      <Panel title="Login history" description="Last 5 sign-in attempts" bodyClassName="-mx-5 -mb-5 sm:-mx-6 sm:-mb-6">
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Result</th>
                <th className={thClass}>Method</th>
                <th className={thClass}>Location</th>
                <th className={thClass}>IP address</th>
                <th className={cn(thClass, "text-right")}>Time</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className={tdClass}>
                    {l.result === "success" ? (
                      <Badge tone="success" dot>Success</Badge>
                    ) : l.result === "failed" ? (
                      <Badge tone="warn" dot>Failed 2FA</Badge>
                    ) : (
                      <Badge tone="danger" dot>Blocked</Badge>
                    )}
                  </td>
                  <td className={tdClass}>{l.method}</td>
                  <td className={tdClass}>{l.location}</td>
                  <td className={cn(tdClass, "font-mono text-[12px]")}>{maskIp(l.ip)}</td>
                  <td className={cn(tdClass, "text-right font-mono text-[12px] text-muted")}>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <ConfirmDialog
        open={revokeSession.open}
        onClose={revokeSession.close}
        tone="danger"
        icon={<LogOut className="size-5" />}
        title="Revoke this session?"
        description={`${revokeSession.data?.name ?? ""} will be signed out immediately and must sign in again with 2FA.`}
        confirmLabel="Revoke session"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 700));
          const target = revokeSession.data;
          if (!target) return;
          setSessions((list) => list.filter((s) => s.id !== target.id));
          toast({ title: "Session revoked", description: `${target.name} has been signed out.` });
        }}
      />

      <ConfirmDialog
        open={revokeAll}
        onClose={() => setRevokeAll(false)}
        tone="danger"
        icon={<ShieldCheck className="size-5" />}
        title="Sign out all other sessions?"
        description="Every browser and app except this one will be signed out. Use this if you think someone else has access."
        confirmLabel="Sign out others"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 800));
          setSessions((list) => list.filter((s) => s.current));
          toast({ title: "Other sessions signed out", description: "Only this device is signed in now." });
        }}
      />

      <ConfirmDialog
        open={removeDevice.open}
        onClose={removeDevice.close}
        tone="danger"
        icon={<KeyRound className="size-5" />}
        title="Remove trusted device?"
        description={`${removeDevice.data?.name ?? ""} will no longer be accepted as a second factor.`}
        confirmLabel="Remove device"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 700));
          const target = removeDevice.data;
          if (!target) return;
          setDevices((list) => list.filter((d) => d.id !== target.id));
          toast({ title: "Device removed", description: target.name });
        }}
      />
    </div>
  );
}
