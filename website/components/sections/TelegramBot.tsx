"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Activity,
  CalendarClock,
  CircleDot,
  HardDrive,
  Lock,
  Power,
  SendHorizontal,
  ShieldAlert,
  Terminal,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/Logo";
import { TelegramIcon } from "@/components/icons/SocialIcons";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

const features: { icon: LucideIcon; title: string }[] = [
  { icon: Activity, title: "Server monitoring" },
  { icon: ShieldAlert, title: "Security alerts" },
  { icon: CircleDot, title: "Service status" },
  { icon: Power, title: "Restart / stop services" },
  { icon: HardDrive, title: "Backup notifications" },
  { icon: Users, title: "User management" },
  { icon: CalendarClock, title: "Automated reports" },
  { icon: Terminal, title: "Custom commands" },
];

type Msg = { id: number; from: "bot" | "user"; time: string; body: ReactNode; tone?: "alert" };

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.from === "user";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex", mine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
          mine
            ? "rounded-br-md bg-gradient-to-b from-primary/[0.2] to-primary/[0.12] text-fg ring-1 ring-primary/25"
            : msg.tone === "alert"
              ? "rounded-bl-md border border-warn/30 bg-warn/[0.06] text-fg"
              : "rounded-bl-md border border-line-soft bg-white/[0.04] text-fg",
        )}
      >
        {msg.body}
        <span className={cn("mt-1 block text-right font-mono text-[10px]", mine ? "text-primary/70" : "text-subtle")}>
          {msg.time}
          {mine && " ✓✓"}
        </span>
      </div>
    </motion.li>
  );
}

function InlineButtons({ buttons }: { buttons: { label: string; onClick: () => void; done?: boolean }[] }) {
  return (
    <div className="mt-2.5 grid grid-flow-col gap-1.5">
      {buttons.map((b) => (
        <button
          key={b.label}
          type="button"
          onClick={b.onClick}
          disabled={b.done}
          className={cn(
            "rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
            b.done
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-line-soft bg-white/[0.04] text-fg-2 hover:border-line hover:bg-primary/[0.06] hover:text-fg",
          )}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

function ServerCard({ onAction }: { onAction: (a: string) => void }) {
  const rows = [
    { label: "CPU", value: 32 },
    { label: "RAM", value: 48 },
  ];
  return (
    <div className="min-w-[220px]">
      <p className="font-medium">Server #01 · edge-fra-01</p>
      <div className="mt-2 space-y-1.5 font-mono text-[12px]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-9 text-muted">{r.label}:</span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${r.value}%` }} />
            </span>
            <span className="w-8 text-right text-fg">{r.value}%</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="w-9 text-muted">Up:</span>
          <span className="text-fg">21 days</span>
        </div>
      </div>
      <InlineButtons
        buttons={[
          { label: "Restart", onClick: () => onAction("restart") },
          { label: "Logs", onClick: () => onAction("logs") },
          { label: "Details", onClick: () => onAction("details") },
        ]}
      />
    </div>
  );
}

function AlertCard({ onBlock, blocked }: { onBlock: () => void; blocked: boolean }) {
  return (
    <div>
      <p className="font-medium text-warn">⚠ Security Alert</p>
      <p className="mt-1">Suspicious login attempt detected.</p>
      <p className="mt-1.5 font-mono text-[11.5px] text-muted">
        IP 203.0.•••.•• · unknown location
        <br />
        2FA challenge failed · 03:14 UTC
      </p>
      <InlineButtons
        buttons={[
          { label: blocked ? "Blocked ✓" : "Block IP", onClick: onBlock, done: blocked },
          { label: "Review", onClick: () => undefined },
        ]}
      />
    </div>
  );
}

function botReply(command: string): ReactNode {
  switch (command.trim().split(/\s+/)[0].toLowerCase()) {
    case "/status":
      return "🟢 All systems operational. 3 servers online · 0 incidents.";
    case "/servers":
      return (
        <span className="font-mono text-[12.5px]">
          edge-fra-01 · 🟢 32% CPU
          <br />
          db-ams-02 · 🟢 41% CPU
          <br />
          app-nyc-03 · 🟡 78% CPU
        </span>
      );
    case "/backup":
      return "✅ Backup started for edge-fra-01. I'll message you when it's done.";
    case "/help":
      return (
        <span className="font-mono text-[12.5px]">
          /status · /servers · /backup · /help
        </span>
      );
    default:
      return "Unknown command. Try /help to see what I can do.";
  }
}

function ChatCard() {
  const toast = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [blocked, setBlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [extra, setExtra] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const nextId = useRef(100);

  function onServerAction(action: string) {
    const labels: Record<string, string> = {
      restart: "Restart queued for edge-fra-01",
      logs: "Last 50 log lines sent to chat",
      details: "Opening server details in the dashboard",
    };
    toast({ title: labels[action], tone: action === "restart" ? "info" : "success" });
  }

  function onBlock() {
    setBlocked(true);
    toast({ title: "IP blocked", description: "203.0.•••.•• added to the firewall deny list.", tone: "success" });
  }

  const script: Msg[] = [
    { id: 1, from: "user", time: "09:41", body: <span className="font-mono">/status</span> },
    { id: 2, from: "bot", time: "09:41", body: "🟢 All systems operational." },
    { id: 3, from: "bot", time: "09:41", body: <ServerCard onAction={onServerAction} /> },
    { id: 4, from: "bot", time: "09:44", tone: "alert", body: <AlertCard onBlock={onBlock} blocked={blocked} /> },
    { id: 5, from: "user", time: "09:45", body: <span className="font-mono">/backup now</span> },
    { id: 6, from: "bot", time: "09:46", body: "✅ Backup completed — 2.4 GB in 41s." },
  ];

  useEffect(() => {
    if (!inView || step >= script.length) return;
    const isBot = script[step].from === "bot";
    const typingDelay = step === 0 ? 400 : 700;
    let reveal: ReturnType<typeof setTimeout>;
    const startTyping = setTimeout(() => {
      if (isBot) setTyping(true);
      reveal = setTimeout(
        () => {
          setTyping(false);
          setStep((s) => s + 1);
        },
        isBot ? 900 : 300,
      );
    }, typingDelay);
    return () => {
      clearTimeout(startTyping);
      clearTimeout(reveal);
    };
    // The script is rebuilt each render; only the step and visibility drive the timeline.
  }, [inView, step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [step, typing, extra.length]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const userMsg: Msg = { id: nextId.current++, from: "user", time, body: <span className="font-mono">{text}</span> };
    setExtra((m) => [...m, userMsg]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setExtra((m) => [...m, { id: nextId.current++, from: "bot", time, body: botReply(text) }]);
    }, 800);
  }

  const visible = [...script.slice(0, step), ...extra];

  return (
    <div ref={ref} className="glass edge relative overflow-hidden rounded-3xl">
      <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
        <LogoMark size={38} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[14.5px] font-semibold text-fg">
            Unknown Host Bot
            <span className="rounded-md bg-white/[0.06] px-1.5 py-px font-mono text-[10px] font-normal uppercase tracking-wider text-muted">
              bot
            </span>
          </p>
          <p className="text-[12px] text-primary/80">{typing ? "typing…" : "online"}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-line-soft px-2.5 py-1 text-[11px] text-muted">
          <Lock className="size-3" aria-hidden /> E2E
        </span>
      </div>

      <ul
        ref={listRef}
        className="no-scrollbar flex h-[420px] flex-col gap-2.5 overflow-y-auto px-4 py-5 sm:px-5"
        aria-label="Example conversation with the Unknown Host bot"
        aria-live="polite"
      >
        <li className="mx-auto mb-1 rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[10.5px] text-muted">Today</li>
        {visible.map((m) => (
          <Bubble key={m.id} msg={m} />
        ))}
        <AnimatePresence>
          {typing && (
            <motion.li
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex"
              aria-label="Bot is typing"
            >
              <span className="flex gap-1 rounded-2xl rounded-bl-md border border-line-soft bg-white/[0.04] px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-pulse-soft rounded-full bg-muted"
                    style={{ animationDelay: `${i * 0.18}s`, animationDuration: "1s" }}
                  />
                ))}
              </span>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-line-soft p-3">
        <label htmlFor="bot-command" className="sr-only">
          Send a command to the bot
        </label>
        <input
          id="bot-command"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Try /status, /servers or /help"
          autoComplete="off"
          className="h-10 flex-1 rounded-xl border border-line-soft bg-[#060c0a]/80 px-3.5 font-mono text-[13px] text-fg placeholder:text-subtle focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
        <button
          type="submit"
          aria-label="Send command"
          disabled={!draft.trim()}
          className="grid size-10 place-items-center rounded-xl bg-primary text-[#02150c] transition-[opacity,box-shadow] hover:shadow-[0_0_20px_-4px_rgba(0,255,136,0.7)] disabled:opacity-40"
        >
          <SendHorizontal className="size-4" />
        </button>
      </form>
    </div>
  );
}

export function TelegramBot() {
  return (
    <section id="telegram" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Telegram Bot"
            title="Control Everything From Telegram"
            description="Manage services, receive alerts and automate routine tasks from the chat app you already have open. Every action is scoped to your role and every risky command asks for confirmation."
          />

          <ul className="mt-10 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 0.04}>
                <div className="flex items-center gap-3 border-b border-line-soft py-3.5">
                  <f.icon className="size-[18px] text-primary" strokeWidth={1.6} aria-hidden />
                  <span className="text-[14.5px] text-fg-2">{f.title}</span>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/docs#telegram-bot" iconLeft={<TelegramIcon className="size-4" />}>
              Connect your bot
            </ButtonLink>
            <p className="font-mono text-[12px] text-muted">Setup takes about two minutes.</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,201,167,0.10),transparent)]"
          />
          <ChatCard />
        </Reveal>
      </div>
    </section>
  );
}
