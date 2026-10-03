import { Check, Fingerprint, History, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Background } from "@/components/Background";
import { Logo } from "@/components/Logo";
import { AuthForm } from "./AuthForm";

const points = [
  { icon: ShieldCheck, title: "Two-factor by default", text: "Authenticator apps, passkeys and hardware keys." },
  { icon: Fingerprint, title: "Device verification", text: "New devices are confirmed before they get access." },
  { icon: History, title: "Full login history", text: "Every attempt is logged with method and location." },
];

export function AuthLayout({ mode }: { mode: "login" | "signup" }) {
  return (
    <>
      <Background />
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex h-16 items-center justify-between lg:h-[72px]">
          <Link href="/" className="rounded-lg" aria-label="Unknown Host — home">
            <Logo />
          </Link>
          <Link href="/" className="rounded text-[13.5px] text-muted transition-colors hover:text-fg">
            Back to site
          </Link>
        </header>

        <main id="main" className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-2 lg:gap-20">
          <div className="mx-auto w-full max-w-md lg:order-2 lg:mx-0 lg:justify-self-end">
            <AuthForm initialMode={mode} />
            <p className="mt-5 flex items-center justify-center gap-2 text-[12px] text-subtle">
              <Check className="size-3.5 text-primary/80" aria-hidden />
              Protected by rate limiting and device verification
            </p>
          </div>

          <div className="hidden lg:block">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-primary/90">Secure. Automate. Control.</p>
            <h2 className="mt-5 max-w-md text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-fg">
              Your infrastructure, <span className="text-gradient">one secure sign-in away.</span>
            </h2>
            <ul className="mt-10 max-w-md space-y-5">
              {points.map((p) => (
                <li key={p.title} className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-soft bg-white/[0.03] text-primary">
                    <p.icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-fg">{p.title}</p>
                    <p className="mt-0.5 text-[14px] text-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-12 max-w-md border-l-2 border-primary/40 pl-4 text-[13.5px] leading-relaxed text-muted">
              We will never ask for your password or 2FA codes by email, phone or Telegram.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
