"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bot,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { DashboardStore, useDashboard, type ViewId } from "./store";
import { BotsView } from "./views/Bots";
import { LogsView } from "./views/Logs";
import { NotificationsView } from "./views/Notifications";
import { Overview } from "./views/Overview";
import { SecurityView } from "./views/Security";
import { Servers } from "./views/Servers";
import { SettingsView } from "./views/Settings";
import { UsersView } from "./views/Users";
import { Avatar, ViewHeader } from "./widgets";

const nav: { id: ViewId; label: string; icon: LucideIcon; group: "main" | "system" }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, group: "main" },
  { id: "servers", label: "Servers", icon: Server, group: "main" },
  { id: "security", label: "Security", icon: ShieldCheck, group: "main" },
  { id: "users", label: "Users", icon: Users, group: "main" },
  { id: "bots", label: "Telegram Bots", icon: Bot, group: "main" },
  { id: "logs", label: "Logs", icon: ScrollText, group: "system" },
  { id: "notifications", label: "Notifications", icon: Bell, group: "system" },
  { id: "settings", label: "Settings", icon: Settings, group: "system" },
];

const isView = (v: string): v is ViewId => nav.some((n) => n.id === v);

function SidebarNav({ view, onSelect }: { view: ViewId; onSelect: (v: ViewId) => void }) {
  const [notifications] = useDashboard().notifications;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-6">
      {(["main", "system"] as const).map((group) => (
        <div key={group}>
          <p className="mb-2 px-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">
            {group === "main" ? "Workspace" : "System"}
          </p>
          <ul className="space-y-0.5">
            {nav
              .filter((n) => n.group === group)
              .map((n) => {
                const active = view === n.id;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(n.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                        active ? "bg-white/[0.06] text-fg" : "text-muted hover:bg-white/[0.03] hover:text-fg",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="dash-nav"
                          className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <n.icon className={cn("size-[18px]", active ? "text-primary" : "text-subtle group-hover:text-fg-2")} strokeWidth={1.7} aria-hidden />
                      {n.label}
                      {n.id === "notifications" && unread > 0 && (
                        <span className="ml-auto rounded-full bg-primary/15 px-1.5 font-mono text-[11px] text-primary">{unread}</span>
                      )}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="rounded-2xl border border-line-soft bg-white/[0.02] p-4">
      <p className="flex items-center gap-2 text-[12.5px] font-medium text-fg">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/50" />
          <span className="relative size-2 rounded-full bg-primary" />
        </span>
        All systems operational
      </p>
      <p className="mt-1 text-[12px] text-muted">5 of 6 servers healthy</p>
      <Link href="/status" className="mt-3 inline-block rounded text-[12px] text-primary/90 hover:text-primary">
        View status page →
      </Link>
    </div>
  );
}

function UserMenu() {
  const router = useRouter();
  const toast = useToast();
  const { navigate } = useDashboard();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-white/[0.05]"
      >
        <Avatar name="Alex Morgan" email="alex@acme.dev" size={30} />
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-[12.5px] font-medium text-fg">Alex Morgan</span>
          <span className="block text-[11px] text-muted">Owner</span>
        </span>
        <ChevronDown className="hidden size-3.5 text-muted md:block" aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass-strong absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl p-1.5"
          >
            <div className="border-b border-line-soft px-3 pb-2.5 pt-2">
              <p className="text-[13px] font-medium text-fg">Alex Morgan</p>
              <p className="text-[12px] text-muted">alex@acme.dev</p>
            </div>
            {[
              { label: "Profile & settings", icon: Settings, action: () => navigate("settings") },
              { label: "Login security", icon: ShieldCheck, action: () => navigate("security") },
            ].map((item) => (
              <button
                key={item.label}
                role="menuitem"
                type="button"
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
                className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-fg-2 transition-colors hover:bg-white/[0.05] hover:text-fg"
              >
                <item.icon className="size-4 text-muted" aria-hidden />
                {item.label}
              </button>
            ))}
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                toast({ title: "Signed out", description: "Your session token was revoked.", tone: "info" });
                router.push("/login");
              }}
              className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#ff8a94] transition-colors hover:bg-danger/10"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Topbar({ title, onMenu }: { title: string; onMenu: () => void }) {
  const { navigate, notifications } = useDashboard();
  const unread = notifications[0].filter((n) => !n.read).length;
  const searchRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-line-soft bg-[#050807]/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="grid size-10 place-items-center rounded-xl border border-line-soft bg-white/[0.03] text-fg lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-[18px]" />
        </button>
        <p className="text-[14px] font-medium text-fg lg:hidden">{title}</p>

        <form
          role="search"
          className="relative hidden max-w-md flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            const q = searchRef.current?.value.trim();
            if (!q) return;
            toast({ title: `No results for “${q}”`, description: "Search covers servers, users, keys and logs.", tone: "info" });
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <label htmlFor="dash-search" className="sr-only">
            Search the dashboard
          </label>
          <input
            ref={searchRef}
            id="dash-search"
            placeholder="Search servers, users, logs…"
            className="h-10 w-full rounded-xl border border-line-soft bg-white/[0.03] pl-9 pr-10 text-[13px] text-fg placeholder:text-subtle transition-[border-color,box-shadow] focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
          <span className="kbd absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden>
            /
          </span>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Badge tone="success" dot pulse className="hidden sm:inline-flex">
            Protected
          </Badge>
          <button
            type="button"
            onClick={() => navigate("notifications")}
            className="relative grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
            aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          >
            <Bell className="size-[18px]" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,136,0.9)]" aria-hidden />
            )}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function ViewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <div className="mt-7 grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SkeletonCard className="h-72 xl:col-span-2" lines={6} />
        <SkeletonCard className="h-72" lines={5} />
      </div>
    </div>
  );
}

function CurrentView({ view }: { view: ViewId }) {
  switch (view) {
    case "overview":
      return (
        <>
          <ViewHeader title="Overview" description="Good morning, Alex. Here’s how your infrastructure is doing." />
          <Overview />
        </>
      );
    case "servers":
      return <Servers />;
    case "security":
      return <SecurityView />;
    case "users":
      return <UsersView />;
    case "bots":
      return <BotsView />;
    case "logs":
      return <LogsView />;
    case "notifications":
      return <NotificationsView />;
    case "settings":
      return <SettingsView />;
  }
}

export function DashboardShell() {
  const [view, setView] = useState<ViewId>("overview");
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const viewRef = useRef(view);
  const navigated = useRef(false);

  const navigate = useCallback((next: ViewId) => {
    setDrawer(false);
    if (viewRef.current === next) return;
    viewRef.current = next;
    navigated.current = true;
    setView(next);
    setLoading(true);
    if (window.location.hash !== `#${next}`) history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0 });
  }, []);

  // Restore the view from the URL hash.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (isView(fromHash)) {
      viewRef.current = fromHash;
      setView(fromHash);
    }
  }, []);

  // Simulated fetch so each view shows its skeleton briefly.
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [loading, view]);

  // Move focus to the new view after in-app navigation (not on first load).
  useEffect(() => {
    if (!loading && navigated.current) mainRef.current?.focus({ preventScroll: true });
  }, [loading]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [drawer]);

  const title = nav.find((n) => n.id === view)?.label ?? "Overview";

  useEffect(() => {
    document.title = `${title} · Dashboard · Unknown Host`;
  }, [title]);

  return (
    <DashboardStore navigate={navigate}>
      <div className="min-h-dvh lg:grid lg:grid-cols-[264px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-line-soft bg-[#060a08]/80 px-4 py-5 backdrop-blur-xl lg:flex">
          <Link href="/" className="rounded-lg px-2" aria-label="Unknown Host — home">
            <Logo />
          </Link>
          <SidebarNav view={view} onSelect={navigate} />
          <SidebarFooter />
        </aside>

        <AnimatePresence>
          {drawer && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawer(false)}
                aria-hidden
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-line-soft bg-[#060a08] px-4 py-5"
                aria-label="Dashboard navigation"
              >
                <div className="flex items-center justify-between">
                  <Link href="/" className="rounded-lg px-2" aria-label="Unknown Host — home">
                    <Logo />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDrawer(false)}
                    className="grid size-9 place-items-center rounded-xl text-muted hover:bg-white/[0.05] hover:text-fg"
                    aria-label="Close navigation"
                    autoFocus
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <SidebarNav view={view} onSelect={navigate} />
                <SidebarFooter />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        <div className="min-w-0">
          <Topbar title={title} onMenu={() => setDrawer(true)} />
          <main ref={mainRef} id="main" tabIndex={-1} className="mx-auto max-w-[1400px] px-4 pb-24 pt-6 outline-none sm:px-6 sm:pt-8 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={loading ? "loading" : view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {loading ? <ViewSkeleton /> : <CurrentView view={view} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </DashboardStore>
  );
}
