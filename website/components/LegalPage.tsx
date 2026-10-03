import type { ReactNode } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: { heading: string; body: ReactNode }[];
}) {
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">{title}</h1>
        <p className="mt-3 font-mono text-[12.5px] text-muted">Last updated {updated}</p>
        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="flex items-baseline gap-3 text-xl font-semibold text-fg">
                <span className="font-mono text-[13px] text-primary/80">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-fg-2">{s.body}</div>
            </section>
          ))}
        </div>
      </article>
    </SiteLayout>
  );
}
