"use client";

import { AlertTriangle, Copy, Fingerprint, KeyRound, Plus, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Field";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import type { ApiKey } from "@/lib/dashboard-data";
import { useDisclosure } from "@/lib/hooks";
import { SecretField } from "../SecretField";
import { useDashboard } from "../store";
import { Panel, ViewHeader, tableClass, tdClass, thClass } from "../widgets";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Login security" },
  { id: "api", label: "API keys" },
  { id: "danger", label: "Workspace" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function generateKey(prefix: string) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `${prefix}${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function ProfileTab() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "Alex Morgan", email: "alex@acme.dev" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({ email: true, telegram: true, weekly: false });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast({ title: "Profile saved" });
  }

  return (
    <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
      <Panel title="Profile" description="Shown to teammates and in audit logs">
        <form onSubmit={save} className="grid gap-4" noValidate>
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} autoComplete="name" />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            hint="Changing it requires confirming the new address."
            autoComplete="email"
          />
          <Select label="Timezone" defaultValue="Europe/Berlin">
            <option>Europe/Berlin</option>
            <option>Europe/London</option>
            <option>America/New_York</option>
            <option>Asia/Singapore</option>
            <option>UTC</option>
          </Select>
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      </Panel>
      <Panel title="Notification preferences" description="Where we reach you about alerts and reports">
        <ul className="divide-y divide-line-soft">
          {(
            [
              ["email", "Email alerts", "Critical security and billing events"],
              ["telegram", "Telegram alerts", "Delivered by @unknownhost_ops_bot"],
              ["weekly", "Weekly report", "Uptime, threats and usage every Monday"],
            ] as const
          ).map(([key, label, detail]) => (
            <li key={key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-[13.5px] text-fg">{label}</p>
                <p className="mt-0.5 text-[12.5px] text-muted">{detail}</p>
              </div>
              <Switch
                label={label}
                checked={prefs[key]}
                onChange={(v) => {
                  setPrefs({ ...prefs, [key]: v });
                  toast({ title: `${label} ${v ? "on" : "off"}`, tone: "info" });
                }}
              />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function LoginSecurityTab() {
  const toast = useToast();
  const [twoFA, setTwoFA] = useState(true);
  const [disableOpen, setDisableOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Partial<typeof pw>>({});
  const [saving, setSaving] = useState(false);

  const strength = Math.min(
    4,
    [pw.next.length >= 12, /[A-Z]/.test(pw.next) && /[a-z]/.test(pw.next), /\d/.test(pw.next), /[^A-Za-z0-9]/.test(pw.next)].filter(Boolean).length,
  );

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const errors: Partial<typeof pw> = {};
    if (!pw.current) errors.current = "Enter your current password.";
    if (pw.next.length < 12) errors.next = "Use at least 12 characters.";
    if (pw.confirm !== pw.next) errors.confirm = "Passwords don’t match.";
    setPwErrors(errors);
    if (Object.keys(errors).length) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setPw({ current: "", next: "", confirm: "" });
    toast({ title: "Password changed", description: "Other sessions were signed out." });
  }

  return (
    <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
      <Panel title="Two-factor authentication" description="A second step every time you sign in">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.015] p-3.5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/[0.08] text-primary">
              <Smartphone className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] text-fg">Authenticator app</p>
              <p className="text-[12px] text-muted">Time-based codes (TOTP)</p>
            </div>
            {twoFA ? <Badge tone="success" dot>Enabled</Badge> : <Badge tone="warn" dot>Off</Badge>}
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.015] p-3.5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/[0.08] text-primary">
              <Fingerprint className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] text-fg">Passkeys</p>
              <p className="text-[12px] text-muted">2 registered · phishing-resistant</p>
            </div>
            <Badge tone="success" dot>Enabled</Badge>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line-soft bg-white/[0.015] p-3.5">
            <span className="grid size-9 place-items-center rounded-lg bg-white/[0.04] text-fg-2">
              <KeyRound className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] text-fg">Recovery codes</p>
              <p className="text-[12px] text-muted">8 of 10 remaining · stored hashed, never shown again</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => toast({ title: "New recovery codes generated", description: "Download them now — old codes stopped working.", tone: "warning" })}>
              Regenerate
            </Button>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          {twoFA ? (
            <Button variant="danger" size="sm" onClick={() => setDisableOpen(true)}>
              Disable authenticator
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setTwoFA(true);
                toast({ title: "Authenticator enabled" });
              }}
            >
              Enable authenticator
            </Button>
          )}
        </div>
      </Panel>

      <Panel title="Password" description="Used together with your second factor">
        <form onSubmit={changePassword} className="grid gap-4" noValidate>
          <Input label="Current password" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} error={pwErrors.current} />
          <div>
            <Input label="New password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={pwErrors.next} />
            <div className="mt-2 flex gap-1" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i < strength ? (strength <= 1 ? "bg-danger" : strength <= 2 ? "bg-warn" : "bg-primary") : "bg-white/[0.07]",
                  )}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[12px] text-muted" aria-live="polite">
              {pw.next ? ["Too weak", "Weak", "Fair", "Good", "Strong"][strength] : "12+ characters with mixed case, numbers and symbols."}
            </p>
          </div>
          <Input label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={pwErrors.confirm} />
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              Update password
            </Button>
          </div>
        </form>
      </Panel>

      <ConfirmDialog
        open={disableOpen}
        onClose={() => setDisableOpen(false)}
        tone="danger"
        icon={<AlertTriangle className="size-5" />}
        title="Disable authenticator app?"
        description="Your account will rely on passkeys only. Admins in this workspace are required to keep at least one second factor."
        confirmLabel="Disable"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 700));
          setTwoFA(false);
          toast({ title: "Authenticator disabled", description: "We recommend turning it back on.", tone: "warning" });
        }}
      />
    </div>
  );
}

function ApiKeysTab() {
  const toast = useToast();
  const [keys, setKeys] = useDashboard().apiKeys;
  const revoke = useDisclosure<ApiKey>();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [scope, setScope] = useState("servers:read");
  const [nameError, setNameError] = useState<string>();
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<ApiKey | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const clean = name.trim();
    if (!/^[a-z0-9][a-z0-9-]{2,40}$/.test(clean)) {
      setNameError("Use 3–41 lowercase letters, numbers or hyphens.");
      return;
    }
    setCreating(true);
    await new Promise((r) => setTimeout(r, 800));
    const key: ApiKey = { id: `k-${Date.now()}`, name: clean, secret: generateKey("uh_live_"), scope, created: "Just now", lastUsed: "Never" };
    setKeys((list) => [key, ...list]);
    setCreating(false);
    setCreated(key);
  }

  function closeCreate() {
    setCreateOpen(false);
    setTimeout(() => {
      setCreated(null);
      setName("");
      setNameError(undefined);
    }, 250);
  }

  async function copyCreated() {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.secret);
      toast({ title: "Key copied", description: "Store it in your secret manager now." });
    } catch {
      toast({ title: "Couldn't copy", description: "Your browser blocked clipboard access.", tone: "error" });
    }
  }

  return (
    <>
      <Panel
        title="API keys"
        description="Keys are masked by default and scoped to the minimum they need."
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)} iconLeft={<Plus className="size-3.5" />}>
            Create key
          </Button>
        }
        bodyClassName="-mx-5 -mb-5 sm:-mx-6 sm:-mb-6"
      >
        {keys.length === 0 ? (
          <EmptyState
            icon={<KeyRound className="size-5" />}
            title="No API keys yet"
            description="Create a key to automate deployments or read metrics from your own tools."
            action={
              <Button size="sm" onClick={() => setCreateOpen(true)} iconLeft={<Plus className="size-3.5" />}>
                Create your first key
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className={cn(tableClass, "min-w-[760px]")}>
              <thead>
                <tr>
                  <th className={thClass}>Name</th>
                  <th className={cn(thClass, "w-[340px]")}>Key</th>
                  <th className={thClass}>Scope</th>
                  <th className={thClass}>Last used</th>
                  <th className={thClass}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id}>
                    <td className={tdClass}>
                      <p className="font-mono text-[12.5px] text-fg">{k.name}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted">Created {k.created}</p>
                    </td>
                    <td className={tdClass}>
                      <SecretField label={`${k.name} key`} secret={k.secret} />
                    </td>
                    <td className={tdClass}>
                      <Badge tone={k.scope.endsWith("write") ? "warn" : "neutral"}>{k.scope}</Badge>
                    </td>
                    <td className={cn(tdClass, "text-[12.5px] text-muted")}>{k.lastUsed}</td>
                    <td className={cn(tdClass, "text-right")}>
                      <Button size="sm" variant="ghost" onClick={() => revoke.show(k)} aria-label={`Revoke ${k.name}`}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Modal
        open={createOpen}
        onClose={closeCreate}
        busy={creating}
        title={created ? "Save your new key" : "Create an API key"}
        description={
          created
            ? "This is the only time the full key is available. Copy it into your secret manager — we only store a hash."
            : "Give it a name you’ll recognise in audit logs and the narrowest scope that works."
        }
        size="md"
        icon={
          created && (
            <div className="grid size-11 place-items-center rounded-2xl border border-line bg-primary/[0.07] text-primary">
              <ShieldCheck className="size-5" />
            </div>
          )
        }
      >
        {created ? (
          <div className="grid gap-4">
            <div className="rounded-xl border border-line-soft bg-[#060b09] p-3.5">
              <p className="text-[12px] text-muted">{created.name}</p>
              <SecretField label="new key" secret={created.secret} className="mt-2" />
            </div>
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={closeCreate}>
                I’ve saved it
              </Button>
              <Button onClick={copyCreated} iconLeft={<Copy className="size-4" />} data-autofocus>
                Copy key
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={create} className="grid gap-4" noValidate>
            <Input
              label="Key name"
              placeholder="deploy-production"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(undefined);
              }}
              error={nameError}
              autoComplete="off"
              data-autofocus
            />
            <Select label="Scope" value={scope} onChange={(e) => setScope(e.target.value)} hint="Write scopes can change infrastructure.">
              <option value="servers:read">servers:read</option>
              <option value="metrics:read">metrics:read</option>
              <option value="servers:write">servers:write</option>
              <option value="firewall:write">firewall:write</option>
            </Select>
            <div className="mt-3 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={closeCreate} disabled={creating}>
                Cancel
              </Button>
              <Button type="submit" loading={creating}>
                Create key
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={revoke.open}
        onClose={revoke.close}
        tone="danger"
        icon={<KeyRound className="size-5" />}
        title={`Revoke ${revoke.data?.name ?? "key"}?`}
        description="Requests signed with this key will start failing immediately. This can’t be undone."
        confirmLabel="Revoke key"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 700));
          const target = revoke.data;
          if (!target) return;
          setKeys((list) => list.filter((k) => k.id !== target.id));
          toast({ title: "Key revoked", description: target.name });
        }}
      />
    </>
  );
}

function WorkspaceTab() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const workspace = "acme-production";

  return (
    <div className="grid gap-4 lg:gap-5">
      <Panel title="Session policy" description="Applies to every member of this workspace">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Idle session timeout" defaultValue="30" onChange={() => toast({ title: "Session timeout updated", tone: "info" })}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="480">8 hours</option>
          </Select>
          <Select label="Require 2FA for" defaultValue="all" onChange={() => toast({ title: "2FA policy updated", tone: "info" })}>
            <option value="all">All members</option>
            <option value="admins">Admins and owners</option>
          </Select>
        </div>
      </Panel>

      <Card className="border-danger/20 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[14.5px] font-semibold text-fg">Delete workspace</h3>
            <p className="mt-1 max-w-xl text-[13px] text-muted">
              Permanently deletes servers, backups, keys and logs in <span className="font-mono text-fg-2">{workspace}</span>. There is a 7-day
              recovery window.
            </p>
          </div>
          <Button variant="danger" onClick={() => setOpen(true)} iconLeft={<Trash2 className="size-4" />}>
            Delete workspace
          </Button>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setConfirmText("");
        }}
        busy={busy}
        title="Delete this workspace?"
        description="All 6 servers will be stopped and scheduled for deletion. Members lose access immediately."
        icon={
          <div className="grid size-11 place-items-center rounded-2xl border border-danger/30 bg-danger/[0.08] text-[#ff8a94]">
            <AlertTriangle className="size-5" />
          </div>
        }
      >
        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            await new Promise((r) => setTimeout(r, 900));
            setBusy(false);
            setOpen(false);
            setConfirmText("");
            toast({ title: "Deletion cancelled in demo mode", description: "Nothing was deleted — this is a preview workspace.", tone: "info" });
          }}
        >
          <Input
            label={`Type ${workspace} to confirm`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            data-autofocus
          />
          <div className="mt-2 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={confirmText !== workspace} loading={busy}>
              Delete permanently
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function SettingsView() {
  const [tab, setTab] = useState<TabId>("profile");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <ViewHeader title="Settings" description="Your profile, sign-in security, API access and workspace policies." />
      <div role="tablist" aria-label="Settings sections" className="no-scrollbar mb-5 flex gap-1 overflow-x-auto border-b border-line-soft">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative whitespace-nowrap px-3.5 pb-3 pt-1 text-[13.5px] font-medium transition-colors",
              tab === t.id ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,136,0.7)]" />}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "profile" && <ProfileTab />}
        {tab === "security" && <LoginSecurityTab />}
        {tab === "api" && <ApiKeysTab />}
        {tab === "danger" && <WorkspaceTab />}
      </div>
    </div>
  );
}
