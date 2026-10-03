"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { navItems } from "@/lib/site";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (!enabled) return;
    const ids = navItems.map((n) => n.section).filter(Boolean) as string[];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  function isActive(item: (typeof navItems)[number]) {
    if (item.section) return onHome && active === item.section;
    return pathname.startsWith(item.href);
  }

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || open
            ? "border-line-soft bg-[#050807]/72 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-[#050807]/20 backdrop-blur-md",
        )}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-8">
          <Link href="/" className="rounded-lg" aria-label="Unknown Host — home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const current = isActive(item);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={current ? (item.section ? "location" : "page") : undefined}
                    className={cn(
                      "relative rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors duration-200",
                      current ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {current && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-[13.5px] font-medium text-fg-2 transition-colors hover:text-fg"
            >
              Log in
            </Link>
            <ButtonLink href="/signup" size="sm" iconRight={<ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />}>
              Get Started
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-line-soft bg-white/[0.03] text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-line-soft bg-[#050807]/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pt-4 sm:px-6">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.25 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                      isActive(item) ? "bg-primary/[0.06] text-fg" : "text-fg-2 hover:bg-white/[0.04] hover:text-fg",
                    )}
                  >
                    {item.label}
                    <ArrowRight className="size-4 text-subtle" aria-hidden />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 px-4 pb-10 sm:px-6">
              <ButtonLink href="/signup" size="lg" onClick={() => setOpen(false)}>
                Get Started
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="secondary" onClick={() => setOpen(false)}>
                Log in
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
