"use client";

import { Check, Fingerprint, History, KeyRound, Laptop, LogOut, Minus, ScrollText, Smartphone, UserCog } from "lucide-react";
import { useState } from "react";
import { SecretField } from "@/components/dashboard/SecretField";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

function Tile({
  icon: Icon,
  title,
  description,
  className,
  children,
  delay = 0,
}: {
  icon: typeof KeyRound;
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={cn("h-full", className)}>
      <div className="glass edge flex h-full flex-col rounded-2xl p-5 transition-[border-color,box-shadow] duration-300 hover:border-line hover:shadow-[0_24px_60px_-30px_rgba(0,255,136,0.3)] sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border border-line-soft bg-white/[0.03] text-primary">
            <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
          </span>
          <h3 className="text-[15px] font-semibold text-fg">{title}</h3>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{description}</p>
        <div className="mt-5 flex-1">{children}</div>
      </div>
    </Reveal>
  );
}

const roles = ["Owner", "Admin", "Operator", "Viewer"];
const matrix = [
  { label: "View metrics", allow: [1, 1, 1, 1] },
  { label: "Restart services", allow: [1, 1, 1, 0] },
  { label: "Manage API keys", allow: [1, 1, 0, 0] },
  { label: "Billing", allow: [1, 0, 0, 0] },
];

export function AccountSecurity() {
  const toast = useToast();
  const [sessions, setSessions] = useState([
    { id: "a", icon: Laptop, name: "MacBook Pro · Chrome", meta: "Berlin · active now", current: true },
    { id: "b", icon: Smartphone, name: "iPhone · Unknown Host app", meta: "Berlin · 18 min ago" },
    { id: "c", icon: Laptop, name: "Windows · Firefox", meta: "Vienna · 2 days ago" },
  ]);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [lastRevoked, setLastRevoked] = useState("");

  return (
    <section id="account-security" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Account security"
          title={
            <>
              Serious protection. <span className="text-muted">Zero friction.</span>
            </>
          }
          description="Security controls that are visible, understandable and quick to use — so the safe choice is always the easy one."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <Tile icon={Fingerprint} title="2FA & passkeys" description="Authenticator apps, hardware keys and passkeys. Required for every admin.">
            <div className="flex justify-between gap-1.5" aria-label="Example 6-digit verification code input" role="img">
              {["4", "8", "1", "9", "", ""].map((d, i) => (
                <span
                  key={i}
                  className={cn(
                    "grid h-12 flex-1 place-items-center rounded-xl border font-mono text-lg",
                    d ? "border-line-soft bg-white/[0.03] text-fg" : i === 4 ? "border-primary/60 bg-primary/[0.04] ring-4 ring-primary/10" : "border-line-soft bg-white/[0.015]",
                  )}
                >
                  {d}
                  {i === 4 && <span className="h-5 w-px animate-pulse bg-primary" />}
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-[12px] text-muted">
              <Check className="size-3.5 text-primary" aria-hidden /> Codes expire in 30 seconds
            </p>
          </Tile>

          <Tile icon={LogOut} title="Session management" description="See every signed-in browser and app, and sign any of them out instantly." delay={0.05}>
            <ul className="space-y-2">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.015] px-3 py-2.5">
                  <s.icon className="size-4 shrink-0 text-fg-2" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] text-fg">{s.name}</p>
                    <p className="text-[11.5px] text-muted">{s.meta}</p>
                  </div>
                  {s.current ? (
                    <Badge tone="success">This device</Badge>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRevokeId(s.id)}
                      className="rounded-lg px-2 py-1 text-[12px] font-medium text-muted transition-colors hover:bg-danger/10 hover:text-[#ff8a94]"
                    >
                      Revoke
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </Tile>

          <Tile icon={History} title="Login history" description="Every attempt, with method and location. Failed ones stand out." delay={0.1}>
            <ol className="space-y-2.5">
              {[
                { ok: true, text: "Passkey · Berlin", time: "09:12" },
                { ok: false, text: "Failed 2FA · unknown location", time: "03:14" },
                { ok: true, text: "Authenticator · Berlin", time: "Yesterday" },
                { ok: true, text: "Passkey · Vienna", time: "Oct 1" },
              ].map((l, i) => (
                <li key={i} className="flex items-center gap-3 text-[12.5px]">
                  <span className={cn("size-1.5 shrink-0 rounded-full", l.ok ? "bg-primary" : "bg-danger")} aria-hidden />
                  <span className={cn("flex-1", l.ok ? "text-fg-2" : "text-[#ff8a94]")}>
                    <span className="sr-only">{l.ok ? "Successful: " : "Failed: "}</span>
                    {l.text}
                  </span>
                  <time className="font-mono text-[11px] text-subtle">{l.time}</time>
                </li>
              ))}
            </ol>
          </Tile>

          <Tile icon={KeyRound} title="API key management" description="Masked by default. Revealing a key asks first, times out and is logged." delay={0.05}>
            <div className="space-y-2.5">
              <p className="flex items-center justify-between text-[12px]">
                <span className="font-mono text-fg-2">production-deploy</span>
                <Badge tone="warn">servers:write</Badge>
              </p>
              <SecretField label="production-deploy key" secret="uh_live_9f2c4e1ab7d84c03b6e2f1a07c3d7f2c" />
              <p className="text-[11.5px] text-muted">Last used 4 min ago · rotates every 90 days</p>
            </div>
          </Tile>

          <Tile icon={UserCog} title="Role-based access" description="Four clear roles. Permissions apply to the dashboard, API and bot alike." delay={0.1}>
            <div className="overflow-hidden rounded-xl border border-line-soft">
              <table className="w-full text-[11.5px]">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-2.5 py-2 text-left font-medium text-subtle">
                      <span className="sr-only">Permission</span>
                    </th>
                    {roles.map((r) => (
                      <th key={r} className="px-1 py-2 text-center font-medium text-muted">
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row) => (
                    <tr key={row.label} className="border-t border-line-soft">
                      <td className="px-2.5 py-2 text-fg-2">{row.label}</td>
                      {row.allow.map((a, i) => (
                        <td key={i} className="px-1 py-2 text-center">
                          {a ? (
                            <Check className="mx-auto size-3.5 text-primary" aria-label="Allowed" />
                          ) : (
                            <Minus className="mx-auto size-3.5 text-subtle" aria-label="Not allowed" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tile>

          <Tile icon={ScrollText} title="Audit logs" description="Who did what, when and from where — kept for a year and exportable." delay={0.15}>
            <ul className="space-y-1.5 font-mono text-[11.5px]">
              {[
                ["09:46", "bot:ops", "backup.completed"],
                ["09:31", "lena", "firewall.rule_updated"],
                ["08:58", "marco", "server.restart"],
                ["08:15", "lena", "apikey.rotated"],
              ].map(([t, who, what]) => (
                <li key={t} className="flex gap-2.5 rounded-lg bg-white/[0.02] px-2.5 py-1.5">
                  <span className="text-subtle">{t}</span>
                  <span className="text-secondary">{who}</span>
                  <span className="truncate text-fg-2">{what}</span>
                </li>
              ))}
            </ul>
          </Tile>
        </div>
      </div>

      <ConfirmDialog
        open={revokeId !== null}
        onClose={() => setRevokeId(null)}
        tone="danger"
        icon={<LogOut className="size-5" />}
        title="Revoke this session?"
        description={`${sessions.find((s) => s.id === revokeId)?.name ?? lastRevoked} will be signed out immediately.`}
        confirmLabel="Revoke session"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 600));
          const target = sessions.find((s) => s.id === revokeId);
          if (target) setLastRevoked(target.name);
          setSessions((list) => list.filter((s) => s.id !== revokeId));
          toast({ title: "Session revoked", description: target?.name });
        }}
      />
    </section>
  );
}
