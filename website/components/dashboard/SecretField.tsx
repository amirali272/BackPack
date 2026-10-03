"use client";

import { Copy, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { maskSecret } from "@/lib/format";

const REVEAL_SECONDS = 15;

/**
 * A secret that is masked by default. Revealing it asks for confirmation and
 * re-masks automatically; copying never puts the value on screen.
 */
export function SecretField({ label, secret, className }: { label: string; secret: string; className?: string }) {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const revealed = remaining > 0;

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [revealed, remaining]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(secret);
      toast({ title: "Copied to clipboard", description: `${label} copied. It was never shown on screen.` });
    } catch {
      toast({ title: "Couldn't copy", description: "Your browser blocked clipboard access.", tone: "error" });
    }
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-1.5", className)}>
      <code
        className={cn(
          "min-w-0 flex-1 truncate rounded-lg border px-2.5 py-1.5 font-mono text-[12px]",
          revealed ? "border-warn/30 bg-warn/[0.05] text-fg" : "border-line-soft bg-[#060b09] text-muted",
        )}
        aria-label={revealed ? `${label}, revealed` : `${label}, hidden`}
      >
        {revealed ? secret : maskSecret(secret)}
      </code>
      {revealed && (
        <span className="w-7 shrink-0 text-center font-mono text-[11px] text-warn" aria-live="polite">
          {remaining}s
        </span>
      )}
      <button
        type="button"
        onClick={() => (revealed ? setRemaining(0) : setConfirmOpen(true))}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
        aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
      >
        {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      <button
        type="button"
        onClick={copy}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
        aria-label={`Copy ${label}`}
      >
        <Copy className="size-4" />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setRemaining(REVEAL_SECONDS);
          toast({ title: "Secret revealed", description: `It will be hidden again in ${REVEAL_SECONDS} seconds. This action was logged.`, tone: "warning" });
        }}
        icon={<ShieldCheck className="size-5" />}
        title={`Reveal ${label}?`}
        description={`Make sure nobody can see your screen. The value is shown for ${REVEAL_SECONDS} seconds and the reveal is recorded in the audit log.`}
        confirmLabel="Reveal for 15s"
      />
    </div>
  );
}
