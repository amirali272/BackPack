import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { value: 99.99, decimals: 2, suffix: "%", label: "Uptime SLA" },
  { value: 12, suffix: "", label: "Global regions" },
  { value: 18, prefix: "<", suffix: "ms", label: "Median edge latency" },
  { value: 2.4, decimals: 1, suffix: "M", label: "Threats blocked monthly" },
];

export function Stats() {
  return (
    <section aria-label="Platform at a glance" className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <dl className="glass edge grid grid-cols-2 overflow-hidden rounded-2xl lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={[
                  "flex flex-col gap-1.5 px-5 py-6 sm:px-8 sm:py-8",
                  i % 2 === 1 ? "border-l border-line-soft" : "",
                  i >= 2 ? "border-t border-line-soft lg:border-t-0" : "",
                  i === 2 ? "lg:border-l" : "",
                ].join(" ")}
              >
                <dt className="order-2 text-[13px] text-muted">{s.label}</dt>
                <dd className="order-1 text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-[34px]">
                  <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
