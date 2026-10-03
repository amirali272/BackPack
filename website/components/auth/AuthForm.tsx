"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CircleCheck, Eye, EyeOff, Fingerprint, LockKeyhole, MailCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type Mode = "login" | "signup";
type Step = "credentials" | "otp" | "verify-email";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

function PasswordInput({
  label,
  value,
  onChange,
  error,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Input
      label={label}
      name="password"
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      hint={hint}
      autoComplete={autoComplete}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}

/** Six single-digit inputs with auto-advance, backspace and paste support. */
function OtpInput({ value, onChange, invalid, disabled }: { value: string; onChange: (v: string) => void; invalid?: boolean; disabled?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  // Focus the first box on mount and again whenever the code is cleared (e.g. after a wrong code).
  useEffect(() => {
    if (!value) refs.current[0]?.focus();
  }, [value]);

  function setAt(i: number, d: string) {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").slice(0, 6));
  }

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="6-digit verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          readOnly={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            setAt(i, v);
            if (v && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) {
              setAt(i - 1, "");
              refs.current[i - 1]?.focus();
            } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            else if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (!pasted) return;
            e.preventDefault();
            onChange(pasted);
            refs.current[Math.min(pasted.length, 5)]?.focus();
          }}
          className={cn(
            "h-14 w-full min-w-0 rounded-xl border bg-[#060c0a]/80 text-center font-mono text-xl text-fg transition-[border-color,box-shadow]",
            "focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/15",
            invalid ? "border-danger/60" : d ? "border-white/[0.14]" : "border-line-soft",
          )}
        />
      ))}
    </div>
  );
}

export function AuthForm({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>("credentials");
  const [form, setForm] = useState({ name: "", email: "", password: "", remember: true, terms: false });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password" | "terms", string>>>({});
  const [banner, setBanner] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(0);

  useEffect(() => {
    if (lockout <= 0) return;
    const t = setTimeout(() => setLockout((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [lockout]);

  const strength = Math.min(
    4,
    [form.password.length >= 12, /[A-Z]/.test(form.password) && /[a-z]/.test(form.password), /\d/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length,
  );

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setBanner(undefined);
    window.history.replaceState(null, "", next === "login" ? "/login" : "/signup");
  }

  async function submitCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: typeof errors = {};
    if (mode === "signup" && form.name.trim().length < 2) found.name = "Enter your full name.";
    if (!emailOk(form.email)) found.email = "Enter a valid email address.";
    if (mode === "login" && !form.password) found.password = "Enter your password.";
    if (mode === "signup" && form.password.length < 12) found.password = "Use at least 12 characters.";
    if (mode === "signup" && !form.terms) found.terms = "Please accept the terms to continue.";
    setErrors(found);
    setBanner(undefined);
    const first = Object.keys(found)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    if (mode === "login" && form.password.length < 8) {
      setBanner("That email and password combination didn’t match. Check for typos and try again.");
      return;
    }
    setStep(mode === "login" ? "otp" : "verify-email");
  }

  async function submitCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (lockout > 0) return;
    if (code.length < 6) {
      setCodeError("Enter all 6 digits from your authenticator app.");
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setBusy(false);
    if (code === "000000") {
      const used = attempts + 1;
      setAttempts(used);
      setCode("");
      if (used >= MAX_ATTEMPTS) {
        setLockout(LOCKOUT_SECONDS);
        setAttempts(0);
        setCodeError(undefined);
      } else {
        setCodeError(`That code didn’t work. ${MAX_ATTEMPTS - used} attempt${MAX_ATTEMPTS - used === 1 ? "" : "s"} left.`);
      }
      return;
    }
    toast({ title: "Signed in", description: form.remember ? "This device will be remembered for 30 days." : "Welcome back." });
    router.push("/dashboard");
  }

  // Submit automatically once the sixth digit is entered. Only the code drives this.
  useEffect(() => {
    if (step === "otp" && code.length === 6 && !busy) void submitCode();
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  const title =
    step === "otp" ? "Two-factor verification" : step === "verify-email" ? "Check your inbox" : mode === "login" ? "Welcome back" : "Create your account";
  const subtitle =
    step === "otp"
      ? "Enter the 6-digit code from your authenticator app."
      : step === "verify-email"
        ? `We sent a verification link to ${form.email.trim()}.`
        : mode === "login"
          ? "Sign in to manage your infrastructure."
          : "Start your 14-day trial. No credit card required.";

  return (
    <div className="glass edge w-full rounded-3xl p-6 sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${mode}-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {step !== "credentials" && (
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setCode("");
                setCodeError(undefined);
              }}
              className="mb-6 inline-flex items-center gap-1.5 rounded-md text-[13px] text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="size-3.5" aria-hidden /> Back
            </button>
          )}

          {step === "otp" && (
            <span className="mb-5 grid size-12 place-items-center rounded-2xl border border-line bg-primary/[0.07] text-primary">
              <LockKeyhole className="size-5" aria-hidden />
            </span>
          )}
          {step === "verify-email" && (
            <span className="mb-5 grid size-12 place-items-center rounded-2xl border border-line bg-primary/[0.07] text-primary">
              <MailCheck className="size-5" aria-hidden />
            </span>
          )}

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-fg sm:text-[28px]">{title}</h1>
          <p className="mt-2 text-[14.5px] text-muted">{subtitle}</p>

          {step === "credentials" && (
            <>
              <div role="tablist" aria-label="Account" className="mt-7 grid grid-cols-2 gap-1 rounded-xl border border-line-soft bg-white/[0.02] p-1">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => switchMode(m)}
                    className={cn(
                      "rounded-lg py-2 text-[13.5px] font-medium transition-colors",
                      mode === m ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {m === "login" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>

              {banner && (
                <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/[0.06] px-3.5 py-3 text-[13px] text-fg-2">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                  {banner}
                </div>
              )}

              <form onSubmit={submitCredentials} noValidate className="mt-6 grid gap-4">
                {mode === "signup" && (
                  <Input label="Full name" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
                )}
                <Input
                  label={mode === "signup" ? "Work email" : "Email"}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />
                <div>
                  <PasswordInput
                    label="Password"
                    value={form.password}
                    onChange={(password) => setForm({ ...form, password })}
                    error={errors.password}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  {mode === "signup" && (
                    <>
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
                        {form.password ? `Strength: ${["Too weak", "Weak", "Fair", "Good", "Strong"][strength]}` : "12+ characters. A passphrase works great."}
                      </p>
                    </>
                  )}
                </div>

                {mode === "login" ? (
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-fg-2">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                        className="size-4 rounded border-line-soft accent-primary"
                      />
                      Remember this device
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toast({
                          title: "Reset link requested",
                          description: emailOk(form.email) ? `If ${form.email.trim()} has an account, a link is on its way.` : "Enter your email first, then try again.",
                          tone: emailOk(form.email) ? "info" : "warning",
                        })
                      }
                      className="rounded text-[13px] text-muted transition-colors hover:text-primary"
                    >
                      Forgot password?
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-fg-2">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={form.terms}
                        onChange={(e) => {
                          setForm({ ...form, terms: e.target.checked });
                          setErrors((x) => ({ ...x, terms: undefined }));
                        }}
                        aria-invalid={errors.terms ? true : undefined}
                        aria-describedby={errors.terms ? "terms-error" : undefined}
                        className="mt-0.5 size-4 shrink-0 rounded accent-primary"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/terms" className="text-fg underline decoration-line-strong underline-offset-4 hover:text-primary">
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-fg underline decoration-line-strong underline-offset-4 hover:text-primary">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.terms && (
                      <p id="terms-error" className="mt-1.5 text-[12.5px] text-[#ff8a94]">
                        {errors.terms}
                      </p>
                    )}
                  </div>
                )}

                <Button type="submit" size="lg" loading={busy} className="mt-1 w-full" iconRight={<ArrowRight className="size-4" />}>
                  {mode === "login" ? "Continue" : "Create account"}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3 text-[12px] text-subtle">
                <span className="h-px flex-1 bg-line-soft" />
                or
                <span className="h-px flex-1 bg-line-soft" />
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                iconLeft={<Fingerprint className="size-4" />}
                onClick={() => toast({ title: "Passkeys need a supported device", description: "In this demo, continue with email instead.", tone: "info" })}
              >
                {mode === "login" ? "Sign in with a passkey" : "Sign up with a passkey"}
              </Button>
            </>
          )}

          {step === "otp" && (
            <form onSubmit={submitCode} className="mt-7" noValidate>
              {lockout > 0 ? (
                <div role="alert" className="rounded-xl border border-warn/30 bg-warn/[0.06] p-4 text-[13.5px] text-fg-2">
                  <p className="font-medium text-fg">Too many attempts</p>
                  <p className="mt-1">
                    For your security, verification is paused. Try again in <span className="font-mono text-warn">{lockout}s</span>.
                  </p>
                </div>
              ) : (
                <>
                  <OtpInput
                    value={code}
                    onChange={(v) => {
                      setCode(v);
                      setCodeError(undefined);
                    }}
                    invalid={!!codeError}
                    disabled={busy}
                  />
                  <p className={cn("mt-3 min-h-5 text-[12.5px]", codeError ? "text-[#ff8a94]" : "text-muted")} role={codeError ? "alert" : undefined}>
                    {codeError ?? "Demo: any code works except 000000."}
                  </p>
                </>
              )}
              <Button type="submit" size="lg" loading={busy} disabled={lockout > 0} className="mt-5 w-full">
                Verify and sign in
              </Button>
              <p className="mt-5 text-center text-[13px] text-muted">
                Lost your device?{" "}
                <button
                  type="button"
                  onClick={() => toast({ title: "Use a recovery code", description: "Enter one of your 10 recovery codes instead of the 6-digit code.", tone: "info" })}
                  className="rounded text-fg-2 underline decoration-line-strong underline-offset-4 hover:text-primary"
                >
                  Use a recovery code
                </button>
              </p>
            </form>
          )}

          {step === "verify-email" && (
            <div className="mt-7">
              <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/[0.05] p-4 text-[13.5px] text-fg-2" role="status">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <p>
                  Account created. Click the link in the email to verify your address — then you’ll set up two-factor authentication.
                </p>
              </div>
              <ButtonLink href="/dashboard" size="lg" className="mt-6 w-full" iconRight={<ArrowRight className="size-4" />}>
                Continue to the demo dashboard
              </ButtonLink>
              <p className="mt-5 text-center text-[13px] text-muted">
                Didn’t get it?{" "}
                <button
                  type="button"
                  onClick={() => toast({ title: "Verification email re-sent", tone: "info" })}
                  className="rounded text-fg-2 underline decoration-line-strong underline-offset-4 hover:text-primary"
                >
                  Resend email
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
