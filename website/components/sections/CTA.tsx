import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CTA() {
  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass edge relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_120%,rgba(0,255,136,0.16),transparent_70%)]" />
            <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,#000,transparent)]" />
            <div className="relative mx-auto max-w-2xl">
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-primary/90">Secure. Automate. Control.</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-[44px] sm:leading-[1.1]">
                Ready to take control of your infrastructure?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-muted">
                Start free for 14 days. No credit card, no lock-in — and a migration engineer if you want one.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/signup" size="lg" iconRight={<ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />}>
                  Get Started
                </ButtonLink>
                <ButtonLink href="/#contact" size="lg" variant="secondary">
                  Talk to sales
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
