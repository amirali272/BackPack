import type { ComponentType, SVGProps } from "react";
import {
  ApiIcon,
  AutomationIcon,
  BackupIcon,
  BotIcon,
  HostingIcon,
  MonitoringIcon,
  ServerManageIcon,
  WebSecurityIcon,
} from "@/components/icons/ServiceIcons";

export const site = {
  name: "Unknown Host",
  tagline: "Secure. Automate. Control.",
  description:
    "Modern hosting, automation and security tools built for developers, businesses and digital infrastructure.",
  footerLine: "Secure infrastructure for the modern web.",
  email: "hello@unknownhost.io",
  support: "support@unknownhost.io",
  telegram: "https://t.me/unknownhost",
  github: "https://github.com/unknownhost",
  x: "https://x.com/unknownhost",
};

export type NavItem = { label: string; href: string; section?: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "/#top", section: "top" },
  { label: "Services", href: "/#services", section: "services" },
  { label: "Security", href: "/#security", section: "security" },
  { label: "Telegram Bot", href: "/#telegram", section: "telegram" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Documentation", href: "/docs" },
  { label: "Contact", href: "/#contact", section: "contact" },
];

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: Icon;
  tag: string;
  details: string;
  features: string[];
};

export const services: Service[] = [
  {
    id: "hosting",
    title: "Secure Hosting",
    description: "Isolated NVMe instances with encrypted storage and hardened images from day one.",
    icon: HostingIcon,
    tag: "NVMe · Isolated",
    details:
      "Every workload runs in its own isolated environment on NVMe storage, encrypted at rest with per-tenant keys and deployed from hardened, patched base images.",
    features: ["AES-256 encryption at rest", "Hardened, auto-patched images", "Private networking by default", "12 regions on three continents"],
  },
  {
    id: "vps",
    title: "VPS / Server Management",
    description: "Provision, resize and operate servers from one console — or from your terminal.",
    icon: ServerManageIcon,
    tag: "Root access",
    details:
      "Spin up virtual servers in seconds, resize without rebuilding and manage packages, users and firewall rules from a single console, a CLI or the API.",
    features: ["Provisioning in under 40 seconds", "Live resize and snapshots", "Browser console with session recording", "Full API and CLI parity"],
  },
  {
    id: "web-security",
    title: "Web Security",
    description: "Managed WAF, bot mitigation and TLS that renews itself before you think about it.",
    icon: WebSecurityIcon,
    tag: "WAF · TLS 1.3",
    details:
      "A managed web application firewall filters injection, scraping and credential-stuffing traffic at the edge, with certificates issued and renewed automatically.",
    features: ["OWASP Top 10 rule sets", "Adaptive bot scoring", "Automatic TLS 1.3 certificates", "Custom rules without redeploys"],
  },
  {
    id: "api",
    title: "API Protection",
    description: "Schema validation, per-key quotas and anomaly detection in front of every endpoint.",
    icon: ApiIcon,
    tag: "Gateway",
    details:
      "Put a secure gateway in front of your APIs: requests are validated against your schema, rate-limited per key and inspected for abuse before they reach your code.",
    features: ["OpenAPI schema enforcement", "Per-key rate limits and quotas", "Signed requests and mTLS", "Anomaly alerts in real time"],
  },
  {
    id: "automation",
    title: "Automation",
    description: "Event-driven workflows for deploys, scaling, rotations and routine maintenance.",
    icon: AutomationIcon,
    tag: "Workflows",
    details:
      "Chain triggers and actions into workflows that deploy, scale, rotate secrets and clean up — scheduled, event-driven or fired from chat.",
    features: ["Cron and event triggers", "Approval steps for risky actions", "Secret rotation playbooks", "Full run history and replay"],
  },
  {
    id: "bots",
    title: "Telegram Bots",
    description: "Alerts, status checks and one-tap actions for your stack, right inside Telegram.",
    icon: BotIcon,
    tag: "ChatOps",
    details:
      "Connect a bot to your workspace and receive alerts, check server health and run approved commands without opening a laptop.",
    features: ["Real-time security alerts", "Role-scoped commands", "Inline confirmations", "Daily and weekly reports"],
  },
  {
    id: "monitoring",
    title: "Monitoring",
    description: "Metrics, logs and uptime checks with alerting that respects your sleep schedule.",
    icon: MonitoringIcon,
    tag: "Observability",
    details:
      "Collect host metrics, application logs and synthetic checks in one place, with alert routing, quiet hours and on-call escalation built in.",
    features: ["1-second metric resolution", "Uptime checks from 12 regions", "Log search with retention policies", "Smart alert grouping"],
  },
  {
    id: "backup",
    title: "Backup & Recovery",
    description: "Encrypted, versioned backups with point-in-time restore and tested recovery plans.",
    icon: BackupIcon,
    tag: "Point-in-time",
    details:
      "Schedule encrypted, immutable backups to a separate region and restore files, databases or whole servers to any point in time.",
    features: ["Immutable, off-site copies", "Point-in-time restore", "Automated restore testing", "Backup notifications in Telegram"],
  },
];

export const footerLinks: { label: string; href: string }[] = [
  { label: "Services", href: "/#services" },
  { label: "Security", href: "/#security" },
  { label: "Telegram Bot", href: "/#telegram" },
  { label: "Documentation", href: "/docs" },
  { label: "Status", href: "/status" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/#contact" },
];
