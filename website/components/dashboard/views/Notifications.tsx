"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellOff, CheckCheck, CircleAlert, CircleCheck, Info, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import type { Notification } from "@/lib/dashboard-data";
import { useDashboard } from "../store";
import { ViewHeader } from "../widgets";

const toneIcon: Record<Notification["tone"], React.ReactNode> = {
  success: <CircleCheck className="size-4 text-primary" aria-hidden />,
  warn: <TriangleAlert className="size-4 text-warn" aria-hidden />,
  danger: <CircleAlert className="size-4 text-danger" aria-hidden />,
  info: <Info className="size-4 text-secondary" aria-hidden />,
};

export function NotificationsView() {
  const toast = useToast();
  const [items, setItems] = useDashboard().notifications;
  const [clearOpen, setClearOpen] = useState(false);
  const unread = items.filter((n) => !n.read).length;

  const groups = (["Today", "Earlier"] as const)
    .map((g) => ({ group: g, items: items.filter((n) => n.group === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <ViewHeader
        title="Notifications"
        description={unread ? `${unread} unread · also delivered to Telegram and email based on your preferences.` : "You’re all caught up."}
        actions={
          items.length > 0 && (
            <>
              <Button
                variant="secondary"
                disabled={unread === 0}
                iconLeft={<CheckCheck className="size-4" />}
                onClick={() => {
                  setItems((list) => list.map((n) => ({ ...n, read: true })));
                  toast({ title: "All notifications marked as read" });
                }}
              >
                Mark all read
              </Button>
              <Button variant="ghost" iconLeft={<Trash2 className="size-4" />} onClick={() => setClearOpen(true)}>
                Clear all
              </Button>
            </>
          )
        }
      />

      <Card className="overflow-hidden">
        {groups.length === 0 ? (
          <EmptyState
            icon={<BellOff className="size-5" />}
            title="No notifications"
            description="Alerts, reports and account activity will show up here as they happen."
          />
        ) : (
          groups.map((g) => (
            <section key={g.group} aria-label={g.group}>
              <h2 className="border-b border-line-soft bg-white/[0.015] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">
                {g.group}
              </h2>
              <ul>
                <AnimatePresence initial={false}>
                  {g.items.map((n) => (
                    <motion.li
                      key={n.id}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-line-soft last:border-b-0"
                    >
                      <div className={cn("flex items-start gap-3.5 px-5 py-4 transition-colors", !n.read && "bg-primary/[0.025]")}>
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.04]">{toneIcon[n.tone]}</span>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 text-[13.5px] font-medium text-fg">
                            {n.title}
                            {!n.read && <span className="size-1.5 rounded-full bg-primary" aria-label="Unread" />}
                          </p>
                          <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{n.body}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <time className="font-mono text-[11.5px] text-subtle">{n.time}</time>
                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                              className="rounded-md text-[12px] text-muted transition-colors hover:text-primary"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          ))
        )}
      </Card>

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        tone="danger"
        icon={<Trash2 className="size-5" />}
        title="Clear all notifications?"
        description="This removes them from your inbox only. The underlying events stay in the audit log."
        confirmLabel="Clear all"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 500));
          setItems([]);
          toast({ title: "Notifications cleared" });
        }}
      />
    </div>
  );
}
