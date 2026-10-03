"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-12 pb-16 sm:pt-20 lg:pt-24 lg:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8">
        <div className="max-w-2xl">
          <motion.a
            {...fadeUp(0)}
            href="#telegram"
            className="group inline-flex items-center gap-2.5 rounded-full border border-line-soft bg-white/[0.03] py-1 pl-1 pr-3 text-[13px] text-fg-2 transition-colors hover:border-line"
          >
            <span className="rounded-full bg-primary/12 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-primary">
              New
            </span>
            Control your servers from Telegram
            <ArrowRight className="size-3.5 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
          </motion.a>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-7 text-balance text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] text-fg sm:text-6xl lg:text-[68px]"
          >
            Your Infrastructure.
            <br />
            <span className="text-gradient">Secured by Design.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-muted sm:text-lg">
            Modern hosting, automation and security tools built for developers, businesses and digital infrastructure.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="/signup"
              size="lg"
              iconRight={<ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />}
            >
              Get Started
            </ButtonLink>
            <ButtonLink href="#services" size="lg" variant="secondary">
              Explore Services
            </ButtonLink>
          </motion.div>

          <motion.ul {...fadeUp(0.32)} className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-[13.5px] text-muted">
            {["Encrypted by default", "2FA on every account", "Deploy in 40 seconds"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-primary" aria-hidden />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
