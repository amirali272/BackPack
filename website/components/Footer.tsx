import Link from "next/link";
import { GitHubIcon, TelegramIcon, XIcon } from "@/components/icons/SocialIcons";
import { Logo } from "@/components/Logo";
import { footerLinks, site } from "@/lib/site";

const socials = [
  { label: "Telegram", href: site.telegram, icon: TelegramIcon },
  { label: "GitHub", href: site.github, icon: GitHubIcon },
  { label: "X", href: site.x, icon: XIcon },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line-soft">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-block rounded-lg" aria-label="Unknown Host — home">
              <Logo />
            </Link>
            <p className="mt-4 text-[15px] text-fg-2">{site.footerLine}</p>
            <p className="mt-1.5 font-mono text-[12px] tracking-wide text-muted">{site.tagline}</p>
            <ul className="mt-6 flex gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Unknown Host on ${s.label}`}
                    className="grid size-10 place-items-center rounded-xl border border-line-soft bg-white/[0.02] text-muted transition-[color,border-color,box-shadow] hover:border-line hover:text-primary hover:shadow-[0_0_20px_-6px_rgba(0,255,136,0.6)]"
                  >
                    <s.icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-4 sm:gap-x-14">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="rounded text-[14px] text-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-line-soft pt-6 text-[12.5px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Unknown Host. All rights reserved.</p>
          <Link href="/status" className="inline-flex items-center gap-2 rounded text-muted transition-colors hover:text-fg">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/50" />
              <span className="relative size-2 rounded-full bg-primary" />
            </span>
            All systems operational
          </Link>
        </div>
      </div>
    </footer>
  );
}
