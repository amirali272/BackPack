"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export function StatusSubscribe() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setBusy(false);
    setEmail("");
    toast({ title: "Subscribed to status updates", description: "We’ll email you when an incident starts and ends." });
  }

  return (
    <form onSubmit={submit} noValidate className="w-full sm:w-auto">
      <div className="flex gap-2">
        <label htmlFor="status-email" className="sr-only">
          Email for status updates
        </label>
        <input
          id="status-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(undefined);
          }}
          placeholder="you@company.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "status-email-error" : undefined}
          className={cn(inputClass, "h-10 min-w-0 flex-1 sm:w-56")}
        />
        <Button type="submit" size="sm" className="h-10" loading={busy}>
          Subscribe
        </Button>
      </div>
      {error && (
        <p id="status-email-error" className="mt-1.5 text-[12.5px] text-[#ff8a94]">
          {error}
        </p>
      )}
    </form>
  );
}
