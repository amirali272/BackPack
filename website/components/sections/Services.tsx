"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, type Service } from "@/lib/site";
import { ServiceCard } from "./ServiceCard";

export function Services() {
  const [selected, setSelected] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const Icon = selected?.icon;

  function learnMore(service: Service) {
    setSelected(service);
    setOpen(true);
  }

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              Everything your stack needs.
              <br className="hidden sm:block" /> <span className="text-muted">Nothing it doesn&apos;t.</span>
            </>
          }
          description="Eight building blocks that work on their own and work better together — one account, one console, one bill."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={(i % 4) * 0.06}>
              <ServiceCard service={service} onLearnMore={learnMore} />
            </Reveal>
          ))}
        </ul>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selected?.title ?? ""}
        description={selected?.details}
        size="md"
        icon={
          Icon && (
            <div className="grid size-12 place-items-center rounded-xl border border-primary/30 bg-primary/[0.06] text-fg shadow-[0_0_24px_-6px_rgba(0,255,136,0.5)]">
              <Icon className="size-6" />
            </div>
          )
        }
        footer={
          <>
            <ButtonLink href="/docs" variant="secondary" onClick={() => setOpen(false)}>
              Read the docs
            </ButtonLink>
            <ButtonLink
              href="/signup"
              onClick={() => setOpen(false)}
              iconRight={<ArrowRight className="size-4" />}
            >
              Start with {selected?.title.split(" ")[0]}
            </ButtonLink>
          </>
        }
      >
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {selected?.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 rounded-xl border border-line-soft bg-white/[0.02] px-3.5 py-3 text-[13.5px] text-fg-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </Modal>
    </section>
  );
}
