"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, CircleCheck, Mail, Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TelegramIcon } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useToast } from "@/components/ui/Toast";
import { site } from "@/lib/site";

type Form = { name: string; email: string; company: string; topic: string; message: string };
type Errors = Partial<Record<keyof Form, string>>;

const empty: Form = { name: "", email: "", company: "", topic: "Sales", message: "" };

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (f.message.trim().length < 10) e.message = "A few more words help us route this to the right person.";
  return e;
}

const channels = [
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: TelegramIcon, label: "Telegram", value: "@unknownhost", href: site.telegram, external: true },
  { icon: Activity, label: "Status", value: "All systems operational", href: "/status" },
  { icon: BookOpen, label: "Docs", value: "Guides & API reference", href: "/docs" },
];

export function Contact() {
  const toast = useToast();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setState("sending");
    await new Promise((r) => setTimeout(r, 1100));
    setState("sent");
    toast({ title: "Message sent", description: "We usually reply within a few hours." });
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Talk to an engineer, not a script."
            description="Questions about migration, compliance or pricing? Our team answers every message — usually within a few hours."
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 0.05}>
                <Link
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full items-start gap-3 rounded-2xl border border-line-soft bg-white/[0.015] p-4 transition-[border-color,background-color] hover:border-line hover:bg-primary/[0.03]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-primary">
                    <c.icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium text-fg">{c.label}</span>
                    <span className="block truncate text-[12.5px] text-muted">{c.value}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <div className="glass edge relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {state === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <span className="grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/[0.08] text-primary shadow-[0_0_30px_-6px_rgba(0,255,136,0.5)]">
                    <CircleCheck className="size-7" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-fg">Thanks, {form.name.split(" ")[0]}.</h3>
                  <p className="mt-2 max-w-sm text-[14px] text-muted">
                    Your message is with our team. We’ll reply to <span className="text-fg-2">{form.email}</span> shortly.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-7"
                    onClick={() => {
                      setForm(empty);
                      setState("idle");
                    }}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={submit}
                  noValidate
                  className="grid gap-5"
                  aria-label="Contact form"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Name" name="name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} required />
                    <Input
                      label="Work email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      error={errors.email}
                      required
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Company" name="company" optional autoComplete="organization" value={form.company} onChange={(e) => set("company", e.target.value)} />
                    <Select label="Topic" name="topic" value={form.topic} onChange={(e) => set("topic", e.target.value)}>
                      <option>Sales</option>
                      <option>Migration help</option>
                      <option>Security & compliance</option>
                      <option>Technical support</option>
                      <option>Partnerships</option>
                    </Select>
                  </div>
                  <Textarea
                    label="How can we help?"
                    name="message"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    error={errors.message}
                    placeholder="Tell us about your stack and what you’re looking for."
                    required
                  />
                  <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12px] text-muted">
                      We never share your details. See our{" "}
                      <Link href="/privacy" className="text-fg-2 underline decoration-line-strong underline-offset-4 hover:text-primary">
                        privacy policy
                      </Link>
                      .
                    </p>
                    <Button type="submit" loading={state === "sending"} iconRight={<ArrowRight className="size-4" />} className="w-full sm:w-auto">
                      {state === "sending" ? "Sending…" : "Send message"}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
