"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "error" | "info" | "warning";

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
};

type ToastItem = Required<Omit<ToastInput, "description">> & { id: number; description?: string };

const ToastContext = createContext<((t: ToastInput) => void) | null>(null);

const toneStyles: Record<ToastTone, { icon: ReactNode; ring: string }> = {
  success: { icon: <CircleCheck className="size-[18px] text-primary" />, ring: "before:bg-primary" },
  error: { icon: <CircleAlert className="size-[18px] text-danger" />, ring: "before:bg-danger" },
  warning: { icon: <TriangleAlert className="size-[18px] text-warn" />, ring: "before:bg-warn" },
  info: { icon: <Info className="size-[18px] text-secondary" />, ring: "before:bg-secondary" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    ({ title, description, tone = "success", duration = 4500 }: ToastInput) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-3), { id, title, description, tone, duration }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
    },
    [dismiss],
  );

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2.5 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              role={t.tone === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "glass-strong pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl py-3.5 pl-4 pr-11",
                "before:absolute before:inset-y-3 before:left-0 before:w-[2px] before:rounded-full",
                toneStyles[t.tone].ring,
              )}
            >
              <span className="mt-px shrink-0">{toneStyles[t.tone].icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
                aria-label="Dismiss notification"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
