"use client";

import { Check, Minus, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select, inputClass } from "@/components/ui/Field";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { permissions, type Role, type User } from "@/lib/dashboard-data";
import { useDisclosure } from "@/lib/hooks";
import { useDashboard } from "../store";
import { Avatar, Panel, ViewHeader, tableClass, tdClass, thClass } from "../widgets";

const roles: Role[] = ["Owner", "Admin", "Operator", "Viewer"];
const assignable: Role[] = ["Admin", "Operator", "Viewer"];

export function UsersView() {
  const toast = useToast();
  const [users, setUsers] = useDashboard().users;
  const remove = useDisclosure<User>();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ email: "", role: "Operator" as Role });
  const [inviteError, setInviteError] = useState<string>();
  const [sending, setSending] = useState(false);

  const without2fa = users.filter((u) => !u.twoFA && u.status === "active").length;

  function changeRole(user: User, role: Role) {
    setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role } : u)));
    toast({ title: "Role updated", description: `${user.name || user.email} is now ${role}.` });
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    const email = invite.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setInviteError("Enter a valid email address.");
      return;
    }
    if (users.some((u) => u.email === email)) {
      setInviteError("This person is already in the workspace.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setUsers((list) => [...list, { id: `u-${Date.now()}`, name: "", email, role: invite.role, twoFA: false, lastActive: "—", status: "invited" }]);
    setSending(false);
    setInviteOpen(false);
    setInvite({ email: "", role: "Operator" });
    toast({ title: "Invitation sent", description: `${email} will join as ${invite.role}. The link expires in 48 hours.` });
  }

  return (
    <div className="grid gap-4 lg:gap-5">
      <ViewHeader
        title="Users"
        description="Members, roles and what each role is allowed to do."
        actions={
          <Button onClick={() => setInviteOpen(true)} iconLeft={<UserPlus className="size-4" />}>
            Invite member
          </Button>
        }
      />

      {without2fa > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-warn/25 bg-warn/[0.05] px-4 py-3.5 text-[13px]" role="note">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
          <p className="text-fg-2">
            <span className="font-medium text-fg">
              {without2fa === 1 ? "1 active member hasn’t" : `${without2fa} active members haven’t`} enabled 2FA.
            </span>{" "}
            They’ll be asked to set it up at their next sign-in.
          </p>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Member</th>
                <th className={thClass}>Role</th>
                <th className={thClass}>2FA</th>
                <th className={thClass}>Last active</th>
                <th className={thClass}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} email={u.email} />
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-[13.5px] text-fg">
                          {u.name || u.email}
                          {u.status === "invited" && <Badge tone="info">Invited</Badge>}
                        </p>
                        {u.name && <p className="text-[12px] text-muted">{u.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={tdClass}>
                    {u.role === "Owner" ? (
                      <Badge tone="success">Owner</Badge>
                    ) : (
                      <>
                        <label htmlFor={`role-${u.id}`} className="sr-only">
                          Role for {u.name || u.email}
                        </label>
                        <select
                          id={`role-${u.id}`}
                          value={u.role}
                          onChange={(e) => changeRole(u, e.target.value as Role)}
                          className={cn(inputClass, "h-8 w-[118px] cursor-pointer appearance-none rounded-lg px-2.5 text-[12.5px]")}
                        >
                          {assignable.map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </td>
                  <td className={tdClass}>
                    {u.twoFA ? <Badge tone="success" dot>Enabled</Badge> : <Badge tone="warn" dot>Off</Badge>}
                  </td>
                  <td className={cn(tdClass, "text-[12.5px] text-muted")}>{u.lastActive}</td>
                  <td className={cn(tdClass, "text-right")}>
                    {u.role !== "Owner" && (
                      <Button size="sm" variant="ghost" onClick={() => remove.show(u)} aria-label={`Remove ${u.name || u.email}`}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Panel title="Roles & permissions" description="Role-based access control applied across the dashboard, API and Telegram bot" bodyClassName="-mx-5 -mb-5 sm:-mx-6 sm:-mb-6">
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Permission</th>
                {roles.map((r) => (
                  <th key={r} className={cn(thClass, "text-center")}>
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p.label}>
                  <td className={tdClass}>{p.label}</td>
                  {roles.map((r) => (
                    <td key={r} className={cn(tdClass, "text-center")}>
                      {(p.roles as readonly string[]).includes(r) ? (
                        <Check className="mx-auto size-4 text-primary" aria-label="Allowed" />
                      ) : (
                        <Minus className="mx-auto size-4 text-subtle" aria-label="Not allowed" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        busy={sending}
        title="Invite a member"
        description="They’ll get an email with a link to join. 2FA is required before their first sign-in completes."
      >
        <form onSubmit={sendInvite} className="grid gap-4" noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            value={invite.email}
            onChange={(e) => {
              setInvite({ ...invite, email: e.target.value });
              setInviteError(undefined);
            }}
            error={inviteError}
            autoComplete="off"
            data-autofocus
          />
          <Select label="Role" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value as Role })} hint="You can change this later.">
            {assignable.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
          <div className="mt-3 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setInviteOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button type="submit" loading={sending}>
              Send invite
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={remove.open}
        onClose={remove.close}
        tone="danger"
        icon={<Trash2 className="size-5" />}
        title={`Remove ${remove.data?.name || remove.data?.email || "member"}?`}
        description="They lose access to the dashboard, API and Telegram bot immediately. Their audit history is kept."
        confirmLabel="Remove member"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 700));
          const target = remove.data;
          if (!target) return;
          setUsers((list) => list.filter((u) => u.id !== target.id));
          toast({ title: "Member removed", description: target.name || target.email });
        }}
      />
    </div>
  );
}
