"use client";

import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { Service } from "@/lib/site";

/** Glass service card with a cursor-following spotlight and a "Learn more" action. */
export function ServiceCard({ service, onLearnMore }: { service: Service; onLearnMore: (s: Service) => void }) {
  const ref = useRef<HTMLElement>(null);
  const Icon = service.icon;

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className="group glass edge relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-line hover:shadow-[0_24px_60px_-30px_rgba(0,255,136,0.4)] focus-within:border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--x, 50%) var(--y, 0%), rgba(0,255,136,0.08), transparent 60%)",
        }}
      />
      <div className="relative flex items-start justify-between">
        <div className="grid size-12 place-items-center rounded-xl border border-line-soft bg-gradient-to-b from-white/[0.06] to-white/[0.01] text-fg-2 transition-[border-color,box-shadow,color] duration-300 group-hover:border-primary/40 group-hover:text-fg group-hover:shadow-[0_0_24px_-4px_rgba(0,255,136,0.45)]">
          <Icon className="size-6" />
        </div>
        <span className="rounded-full border border-line-soft px-2.5 py-0.5 font-mono text-[10.5px] text-muted">
          {service.tag}
        </span>
      </div>
      <h3 className="relative mt-6 text-[17px] font-semibold tracking-[-0.01em] text-fg">{service.title}</h3>
      <p className="relative mt-2 flex-1 text-[14px] leading-relaxed text-muted">{service.description}</p>
      <button
        type="button"
        onClick={() => onLearnMore(service)}
        className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-md text-[13.5px] font-medium text-fg-2 transition-colors hover:text-primary focus-visible:text-primary after:absolute after:inset-0 after:content-['']"
        aria-label={`Learn more about ${service.title}`}
      >
        Learn more
        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </button>
    </article>
  );
}
