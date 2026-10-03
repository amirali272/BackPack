# Unknown Host — website

Marketing site, auth flow and demo admin dashboard for **Unknown Host** — *Secure. Automate. Control.*

Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, Framer Motion and Lucide icons. Charts are hand-rolled SVG; there are no other runtime dependencies.

## Run it

```bash
cd website
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes are static)
npm run start
npm run typecheck
```

## Routes

| Route        | What it is |
| ------------ | ---------- |
| `/`          | Landing page: hero, services, security console, Telegram bot, dashboard preview, account security, contact |
| `/dashboard` | Interactive admin demo: Overview, Servers, Security, Users, Telegram Bots, Logs, Notifications, Settings (deep-linkable via `#servers`, `#logs`, …) |
| `/login`, `/signup` | Auth flow with validation, 2FA step (any code except `000000` succeeds; three wrong codes trigger a lockout) |
| `/docs`      | Documentation |
| `/status`    | Status page with 90-day uptime history |
| `/privacy`, `/terms` | Legal pages |

## Structure

```
app/                  routes, global styles, icons, manifest
components/
  ui/                 Button, Card, Modal + ConfirmDialog, Toast, Field, Badge, Switch, Skeleton, EmptyState, Counter, Reveal
  sections/           landing-page sections (Hero, Services, SecuritySection, TelegramBot, …)
  dashboard/          DashboardShell, store, widgets, SecretField and one file per view
  auth/, docs/        page-specific components
  charts.tsx          AreaChart, BarChart, Sparkline, RadialGauge, Meter
  Logo.tsx            logo mark (also app/icon.svg)
lib/                  site content, placeholder dashboard data, helpers
```

## Design system

Colours are Tailwind theme tokens in `app/globals.css` (`bg`, `bg-2`, `bg-3`, `primary`, `primary-600`, `secondary`, `fg`, `muted`, `line`, …). Glass surfaces use the `.glass` / `.glass-strong` component classes with the `.edge` hairline highlight.

## Notes

- All data is placeholder data. IP addresses come from documentation ranges and are masked in the UI.
- Secrets (API keys, bot tokens) are masked by default. Revealing one asks for confirmation, auto-hides after 15 seconds, and copying never shows the value.
- Motion respects `prefers-reduced-motion`.
