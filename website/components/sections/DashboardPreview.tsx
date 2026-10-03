import { ArrowRight, Bell, Bot, LayoutDashboard, ScrollText, Server, Settings, ShieldCheck, Users } from "lucide-react";
import { Overview } from "@/components/dashboard/views/Overview";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const items = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Servers", icon: Server },
  { label: "Security", icon: ShieldCheck },
  { label: "Users", icon: Users },
  { label: "Telegram Bots", icon: Bot },
  { label: "Logs", icon: ScrollText },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dashboard"
          title="One console. Every server, user and alert."
          description="Live metrics, security posture and team access in a single, fast dashboard — designed to be calm when things are fine and clear when they aren't."
        />

        <Reveal className="relative mt-14" y={28}>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-16 -top-24 bottom-0 -z-10 bg-[radial-gradient(closest-side,rgba(0,255,136,0.10),transparent)]"
          />
          <div className="glass edge overflow-hidden rounded-3xl p-1.5 shadow-[0_40px_120px_-40px_rgba(0,255,136,0.25)]">
            <div className="overflow-hidden rounded-[20px] border border-line-soft bg-[#060a08]/90" inert>
              <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                <div className="flex items-center gap-3">
                  <Logo size={24} className="[&>span:last-child]:text-[13px]" />
                  <span className="hidden text-subtle sm:inline">/</span>
                  <span className="hidden text-[13px] text-fg-2 sm:inline">acme-production</span>
                </div>
                <Badge tone="success" dot pulse>
                  Protected
                </Badge>
              </div>
              <div className="flex">
                <ul className="hidden w-52 shrink-0 flex-col gap-0.5 border-r border-line-soft p-3 lg:flex" aria-hidden>
                  {items.map((it, i) => (
                    <li
                      key={it.label}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px]",
                        i === 0 ? "bg-white/[0.06] text-fg" : "text-muted",
                      )}
                    >
                      {i === 0 && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" />}
                      <it.icon className={cn("size-4", i === 0 ? "text-primary" : "text-subtle")} strokeWidth={1.7} />
                      {it.label}
                    </li>
                  ))}
                </ul>
                <div className="min-w-0 flex-1 p-3 sm:p-5">
                  <Overview compact />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 flex justify-center" delay={0.1}>
          <ButtonLink
            href="/dashboard"
            variant="secondary"
            size="lg"
            iconRight={<ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />}
          >
            Open the live demo
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
