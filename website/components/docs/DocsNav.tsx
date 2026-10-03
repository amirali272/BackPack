"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function DocsNav({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Documentation">
      <p className="mb-3 hidden px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle lg:block">On this page</p>
      <ul className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0.5 lg:px-0">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2 text-[13.5px] transition-colors",
                active === s.id
                  ? "bg-primary/[0.07] text-fg lg:shadow-[inset_2px_0_0_#00FF88]"
                  : "border border-line-soft text-muted hover:text-fg lg:border-transparent",
              )}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
