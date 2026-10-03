import { Info, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNav } from "@/components/docs/DocsNav";
import { SiteLayout } from "@/components/SiteLayout";
import { Eyebrow } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Guides and API reference for Unknown Host: CLI, API keys, servers, Telegram bot, security and webhooks.",
};

const sections = [
  { id: "getting-started", title: "Getting started" },
  { id: "authentication", title: "Authentication" },
  { id: "servers-api", title: "Servers API" },
  { id: "telegram-bot", title: "Telegram bot" },
  { id: "security", title: "Security model" },
  { id: "webhooks", title: "Webhooks" },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-line-soft pb-12 pt-2 last:border-b-0">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-fg">
        <a href={`#${id}`} className="rounded hover:text-primary">
          {title}
        </a>
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-fg-2 [&_code:not(pre_code)]:rounded-md [&_code:not(pre_code)]:bg-white/[0.06] [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-[13px] [&_code:not(pre_code)]:text-fg">
        {children}
      </div>
    </section>
  );
}

function Callout({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "security" }) {
  const Icon = tone === "security" ? ShieldCheck : Info;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-primary/[0.04] p-4 text-[14px]">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div className="text-fg-2">{children}</div>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-2xl border border-line-soft">
      <table className="w-full min-w-[480px] text-left text-[13.5px]">
        <thead className="bg-white/[0.02]">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-medium text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line-soft">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5 align-top text-fg-2">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <header className="max-w-3xl">
          <Eyebrow>Documentation</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">Build on Unknown Host</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Everything you need to deploy servers, automate operations and wire alerts into Telegram — from the CLI, the REST API or the
            dashboard.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <DocsNav sections={sections} />
          </aside>

          <article className="min-w-0 max-w-3xl space-y-12">
            <Section id="getting-started" title="Getting started">
              <p>Install the CLI, sign in once, and create your first server. The CLI uses the same API and permissions as the dashboard.</p>
              <CodeBlock
                code={`# install the CLI
curl -fsSL https://get.unknownhost.io/cli | sh

# sign in (opens your browser, 2FA required)
uh login

# create a server in Frankfurt
uh servers create api-fra-01 --region fra --plan pro-4`}
              />
              <Callout>
                New servers boot from a hardened image with SSH keys, a deny-by-default firewall and monitoring already enabled.
              </Callout>
            </Section>

            <Section id="authentication" title="Authentication">
              <p>
                API requests are authenticated with a bearer key. Create keys under <strong className="text-fg">Settings → API keys</strong> and give
                each one the narrowest scope it needs.
              </p>
              <CodeBlock code={`export UH_API_KEY="<your key>"   # store it in your secret manager

curl https://api.unknownhost.io/v1/servers \\
  -H "Authorization: Bearer $UH_API_KEY"`} />
              <Table
                head={["Scope", "Allows"]}
                rows={[
                  [<code key="a">servers:read</code>, "List servers, read status and metrics"],
                  [<code key="b">servers:write</code>, "Create, resize, restart and stop servers"],
                  [<code key="c">firewall:write</code>, "Create and change firewall rules"],
                  [<code key="d">metrics:read</code>, "Read metrics and uptime checks only"],
                ]}
              />
              <Callout tone="security">
                The full key is shown once, when it’s created. Afterwards it is masked everywhere and we only store a hash. Rotate keys at least every
                90 days.
              </Callout>
            </Section>

            <Section id="servers-api" title="Servers API">
              <p>
                List servers with <code>GET /v1/servers</code>. Responses are JSON and paginated with a cursor.
              </p>
              <CodeBlock
                label="json"
                code={`{
  "data": [
    {
      "id": "srv_01HZX4",
      "name": "edge-fra-01",
      "region": "fra",
      "status": "online",
      "cpu": 0.32,
      "memory": 0.48,
      "uptime_seconds": 1828800
    }
  ],
  "next_cursor": null
}`}
              />
              <p>
                Restart a server with <code>POST /v1/servers/&#123;id&#125;/restart</code>. Write actions are recorded in the audit log with the key
                name that performed them.
              </p>
            </Section>

            <Section id="telegram-bot" title="Telegram bot">
              <p>Connect a bot to your workspace to receive alerts and run approved commands from chat.</p>
              <ol className="list-decimal space-y-2 pl-5 marker:text-primary">
                <li>Create a bot with BotFather and copy its token.</li>
                <li>
                  Open <strong className="text-fg">Dashboard → Telegram Bots</strong> and paste the token. It’s encrypted at rest and masked in the UI.
                </li>
                <li>
                  Send <code>/start</code> to your bot, then confirm the pairing code in the dashboard.
                </li>
              </ol>
              <Table
                head={["Command", "What it does", "Confirmation"]}
                rows={[
                  [<code key="1">/status</code>, "Summary of all services", "—"],
                  [<code key="2">/servers</code>, "Servers with CPU and RAM", "—"],
                  [<code key="3">/restart &lt;name&gt;</code>, "Restart a service", "Inline confirm"],
                  [<code key="4">/backup &lt;name&gt;</code>, "Run an on-demand backup", "Inline confirm"],
                  [<code key="5">/logs &lt;name&gt;</code>, "Last 50 log lines", "—"],
                ]}
              />
              <Callout tone="security">Commands respect the role of the Telegram account that sends them. Viewers can read status but can’t restart anything.</Callout>
            </Section>

            <Section id="security" title="Security model">
              <ul className="list-disc space-y-2 pl-5 marker:text-primary">
                <li>Two-factor authentication is required for Owners and Admins, and can be enforced for everyone.</li>
                <li>Roles — Owner, Admin, Operator, Viewer — apply equally to the dashboard, API and bot.</li>
                <li>Sessions expire after inactivity and can be revoked individually or all at once.</li>
                <li>Every sign-in, configuration change and secret reveal is written to the audit log, retained for 365 days.</li>
                <li>Data is encrypted in transit with TLS 1.3 and at rest with AES-256.</li>
              </ul>
              <p>
                Found a vulnerability? Email <a href="mailto:security@unknownhost.io" className="text-primary hover:underline">security@unknownhost.io</a>.
              </p>
            </Section>

            <Section id="webhooks" title="Webhooks">
              <p>
                Webhooks are signed with HMAC-SHA256. Verify the <code>X-UH-Signature</code> header before trusting a payload, and reject events older
                than five minutes.
              </p>
              <CodeBlock
                label="typescript"
                code={`import { createHmac, timingSafeEqual } from "node:crypto";

export function verify(body: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(body).digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && timingSafeEqual(expected, received);
}`}
              />
              <p>
                Need help? <Link href="/#contact" className="text-primary hover:underline">Talk to an engineer</Link>.
              </p>
            </Section>
          </article>
        </div>
      </div>
    </SiteLayout>
  );
}
