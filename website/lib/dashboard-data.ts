/**
 * Placeholder data for the dashboard demo. Nothing here is real: IPs are
 * documentation ranges and secrets are generated strings that are only ever
 * rendered masked.
 */

export type ServerStatus = "online" | "degraded" | "offline" | "provisioning" | "unreachable";

export type Server = {
  id: string;
  name: string;
  region: string;
  ip: string;
  os: string;
  plan: string;
  status: ServerStatus;
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
};

export const servers: Server[] = [
  { id: "srv-01", name: "edge-fra-01", region: "Frankfurt", ip: "203.0.113.24", os: "Debian 13", plan: "Pro 8 vCPU", status: "online", cpu: 32, ram: 48, disk: 41, uptime: "21d 4h" },
  { id: "srv-02", name: "db-ams-02", region: "Amsterdam", ip: "198.51.100.12", os: "Ubuntu 24.04", plan: "Memory 16 GB", status: "online", cpu: 41, ram: 67, disk: 58, uptime: "48d 11h" },
  { id: "srv-03", name: "app-nyc-03", region: "New York", ip: "192.0.2.77", os: "Ubuntu 24.04", plan: "Pro 4 vCPU", status: "degraded", cpu: 78, ram: 71, disk: 63, uptime: "9d 2h" },
  { id: "srv-04", name: "worker-lon-01", region: "London", ip: "203.0.113.90", os: "Debian 13", plan: "Standard 2 vCPU", status: "online", cpu: 18, ram: 36, disk: 22, uptime: "112d 7h" },
  { id: "srv-05", name: "backup-sgp-04", region: "Singapore", ip: "198.51.100.201", os: "Rocky 10", plan: "Storage 2 TB", status: "unreachable", cpu: 0, ram: 0, disk: 74, uptime: "—" },
  { id: "srv-06", name: "staging-fra-02", region: "Frankfurt", ip: "192.0.2.15", os: "Alpine 3.22", plan: "Standard 2 vCPU", status: "offline", cpu: 0, ram: 0, disk: 12, uptime: "—" },
];

export type Role = "Owner" | "Admin" | "Operator" | "Viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  twoFA: boolean;
  lastActive: string;
  status: "active" | "invited";
};

export const users: User[] = [
  { id: "u1", name: "Alex Morgan", email: "alex@acme.dev", role: "Owner", twoFA: true, lastActive: "Now", status: "active" },
  { id: "u2", name: "Lena Fischer", email: "lena@acme.dev", role: "Admin", twoFA: true, lastActive: "12 min ago", status: "active" },
  { id: "u3", name: "Marco Rossi", email: "marco@acme.dev", role: "Operator", twoFA: true, lastActive: "2 h ago", status: "active" },
  { id: "u4", name: "Priya Nair", email: "priya@acme.dev", role: "Operator", twoFA: false, lastActive: "Yesterday", status: "active" },
  { id: "u5", name: "Jonas Berg", email: "jonas@acme.dev", role: "Viewer", twoFA: true, lastActive: "3 days ago", status: "active" },
  { id: "u6", name: "", email: "sam@contractor.io", role: "Viewer", twoFA: false, lastActive: "—", status: "invited" },
];

export const permissions = [
  { label: "View servers & metrics", roles: ["Owner", "Admin", "Operator", "Viewer"] },
  { label: "Restart / stop services", roles: ["Owner", "Admin", "Operator"] },
  { label: "Edit firewall rules", roles: ["Owner", "Admin"] },
  { label: "Manage API keys", roles: ["Owner", "Admin"] },
  { label: "Invite & remove users", roles: ["Owner", "Admin"] },
  { label: "Billing & workspace deletion", roles: ["Owner"] },
] as const;

export type Session = { id: string; device: "laptop" | "phone" | "desktop"; name: string; location: string; ip: string; lastSeen: string; current?: boolean };

export const sessions: Session[] = [
  { id: "s1", device: "laptop", name: "MacBook Pro · Chrome 141", location: "Berlin, DE", ip: "203.0.113.8", lastSeen: "Active now", current: true },
  { id: "s2", device: "phone", name: "iPhone 17 · Unknown Host app", location: "Berlin, DE", ip: "203.0.113.61", lastSeen: "18 min ago" },
  { id: "s3", device: "desktop", name: "Windows 11 · Firefox 143", location: "Vienna, AT", ip: "198.51.100.44", lastSeen: "2 days ago" },
];

export type Device = { id: string; name: string; type: "laptop" | "phone" | "key"; added: string; trusted: boolean };

export const devices: Device[] = [
  { id: "d1", name: "MacBook Pro (Touch ID passkey)", type: "laptop", added: "Mar 2, 2026", trusted: true },
  { id: "d2", name: "iPhone 17 (Authenticator)", type: "phone", added: "Jan 14, 2026", trusted: true },
  { id: "d3", name: "YubiKey 5C NFC", type: "key", added: "Nov 30, 2025", trusted: true },
];

export type LoginAttempt = { id: string; result: "success" | "failed" | "blocked"; method: string; location: string; ip: string; time: string };

export const loginHistory: LoginAttempt[] = [
  { id: "l1", result: "success", method: "Passkey", location: "Berlin, DE", ip: "203.0.113.8", time: "Today, 09:12" },
  { id: "l2", result: "failed", method: "Password + 2FA", location: "Unknown", ip: "203.0.113.199", time: "Today, 03:14" },
  { id: "l3", result: "blocked", method: "Password", location: "Unknown", ip: "192.0.2.230", time: "Today, 03:13" },
  { id: "l4", result: "success", method: "Authenticator", location: "Berlin, DE", ip: "203.0.113.61", time: "Yesterday, 18:40" },
  { id: "l5", result: "success", method: "Passkey", location: "Vienna, AT", ip: "198.51.100.44", time: "Oct 1, 11:02" },
];

export type ApiKey = { id: string; name: string; secret: string; scope: string; created: string; lastUsed: string };

export const apiKeys: ApiKey[] = [
  { id: "k1", name: "production-deploy", secret: "uh_live_9f2c4e1ab7d84c03b6e2f1a07c3d7f2c", scope: "servers:write", created: "Aug 12, 2026", lastUsed: "4 min ago" },
  { id: "k2", name: "monitoring-readonly", secret: "uh_live_31b07d5e9a2f4c88b1d6e0f4a92e18aa", scope: "metrics:read", created: "Jun 3, 2026", lastUsed: "1 min ago" },
  { id: "k3", name: "ci-staging", secret: "uh_test_c5e19a7b2d3f4e60a8b9c1d2e3f40b17", scope: "servers:read", created: "Sep 28, 2026", lastUsed: "Never" },
];

export type AuditLevel = "info" | "warning" | "critical";

export type AuditLog = { id: string; time: string; actor: string; action: string; target: string; ip: string; level: AuditLevel };

export const auditLogs: AuditLog[] = [
  { id: "a1", time: "09:46:12", actor: "bot:ops", action: "backup.completed", target: "edge-fra-01", ip: "internal", level: "info" },
  { id: "a2", time: "09:44:03", actor: "system", action: "auth.login_failed", target: "alex@acme.dev", ip: "203.0.113.199", level: "critical" },
  { id: "a3", time: "09:31:57", actor: "lena@acme.dev", action: "firewall.rule_updated", target: "rule #14 geo-block", ip: "203.0.113.61", level: "warning" },
  { id: "a4", time: "09:12:40", actor: "alex@acme.dev", action: "auth.login", target: "passkey", ip: "203.0.113.8", level: "info" },
  { id: "a5", time: "08:58:21", actor: "marco@acme.dev", action: "server.restart", target: "app-nyc-03", ip: "198.51.100.44", level: "warning" },
  { id: "a6", time: "08:40:09", actor: "system", action: "ddos.mitigated", target: "edge-fra-01 · 48k pps", ip: "198.51.100.4", level: "critical" },
  { id: "a7", time: "08:15:33", actor: "lena@acme.dev", action: "apikey.rotated", target: "production-deploy", ip: "203.0.113.61", level: "warning" },
  { id: "a8", time: "07:52:10", actor: "bot:ops", action: "report.sent", target: "daily-digest", ip: "internal", level: "info" },
  { id: "a9", time: "07:30:00", actor: "system", action: "tls.renewed", target: "*.acme.dev", ip: "internal", level: "info" },
  { id: "a10", time: "06:02:44", actor: "priya@acme.dev", action: "user.role_changed", target: "jonas@acme.dev → Viewer", ip: "192.0.2.90", level: "warning" },
];

export type Notification = { id: string; title: string; body: string; time: string; tone: "success" | "warn" | "danger" | "info"; read: boolean; group: "Today" | "Earlier" };

export const notifications: Notification[] = [
  { id: "n1", title: "Suspicious login blocked", body: "A login to alex@acme.dev from 203.0.•••.•• failed the 2FA challenge.", time: "09:44", tone: "danger", read: false, group: "Today" },
  { id: "n2", title: "Backup completed", body: "edge-fra-01 · 2.4 GB in 41 seconds.", time: "09:46", tone: "success", read: false, group: "Today" },
  { id: "n3", title: "High CPU on app-nyc-03", body: "CPU has been above 75% for 15 minutes.", time: "09:20", tone: "warn", read: false, group: "Today" },
  { id: "n4", title: "TLS certificate renewed", body: "*.acme.dev renewed automatically, valid for 90 days.", time: "07:30", tone: "info", read: true, group: "Today" },
  { id: "n5", title: "Weekly report ready", body: "Uptime 99.99% · 84,120 threats blocked · 0 incidents.", time: "Mon", tone: "info", read: true, group: "Earlier" },
  { id: "n6", title: "New team member", body: "Jonas Berg joined the workspace as Viewer.", time: "Sep 29", tone: "success", read: true, group: "Earlier" },
];

export type FirewallRule = { id: string; name: string; detail: string; enabled: boolean };

export const firewallRules: FirewallRule[] = [
  { id: "f1", name: "Block known malicious IPs", detail: "Threat-intel feed · updated hourly", enabled: true },
  { id: "f2", name: "Geo-block admin routes", detail: "/admin/* allowed from DE, AT only", enabled: true },
  { id: "f3", name: "SSH from allow-list only", detail: "3 trusted networks", enabled: true },
  { id: "f4", name: "Challenge suspicious bots", detail: "Bot score below 0.3", enabled: false },
];

export type BotCommand = { cmd: string; description: string; enabled: boolean; confirm?: boolean };

export const botCommands: BotCommand[] = [
  { cmd: "/status", description: "Summary of all services", enabled: true },
  { cmd: "/servers", description: "List servers with CPU and RAM", enabled: true },
  { cmd: "/restart", description: "Restart a service", enabled: true, confirm: true },
  { cmd: "/backup", description: "Trigger an on-demand backup", enabled: true, confirm: true },
  { cmd: "/logs", description: "Tail the last 50 log lines", enabled: true },
  { cmd: "/users", description: "Invite or suspend members", enabled: false, confirm: true },
];

export const hours24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
export const days7 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const trafficIn = [1.1, 0.9, 0.8, 0.7, 0.8, 1.0, 1.4, 1.9, 2.3, 2.6, 2.8, 3.0, 3.1, 3.0, 2.9, 2.9, 3.1, 3.3, 3.4, 3.2, 2.8, 2.3, 1.8, 1.4];
export const trafficOut = [0.6, 0.5, 0.5, 0.4, 0.5, 0.6, 0.8, 1.1, 1.3, 1.5, 1.6, 1.7, 1.8, 1.7, 1.7, 1.6, 1.8, 1.9, 2.0, 1.9, 1.6, 1.3, 1.0, 0.8];
export const securityEvents7d = [42, 38, 61, 47, 55, 29, 37];
export const botActivity24 = [12, 8, 5, 4, 6, 14, 38, 72, 96, 120, 134, 128, 140, 126, 118, 122, 131, 144, 152, 138, 110, 84, 52, 31];
export const uptimeSpark = [99.97, 99.99, 100, 99.98, 100, 100, 99.99, 100, 100, 99.99, 100, 100];
export const usersSpark = [920, 980, 1010, 1060, 1040, 1120, 1150, 1190, 1210, 1240, 1262, 1284];
export const cpuSpark = [28, 31, 35, 30, 34, 38, 33, 29, 32, 36, 34, 32];
export const ramSpark = [44, 45, 47, 46, 48, 49, 47, 46, 48, 49, 48, 48];
