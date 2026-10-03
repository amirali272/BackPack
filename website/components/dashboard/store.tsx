"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import * as data from "@/lib/dashboard-data";

export type ViewId = "overview" | "servers" | "security" | "users" | "bots" | "logs" | "notifications" | "settings";

type State<T> = [T, Dispatch<SetStateAction<T>>];

type Store = {
  servers: State<data.Server[]>;
  users: State<data.User[]>;
  sessions: State<data.Session[]>;
  devices: State<data.Device[]>;
  apiKeys: State<data.ApiKey[]>;
  notifications: State<data.Notification[]>;
  firewall: State<data.FirewallRule[]>;
  commands: State<data.BotCommand[]>;
  navigate: (view: ViewId) => void;
};

const StoreContext = createContext<Store | null>(null);

/** Holds the demo workspace so edits survive switching between dashboard views. */
export function DashboardStore({ children, navigate }: { children: ReactNode; navigate: (view: ViewId) => void }) {
  const store: Store = {
    servers: useState(data.servers),
    users: useState(data.users),
    sessions: useState(data.sessions),
    devices: useState(data.devices),
    apiKeys: useState(data.apiKeys),
    notifications: useState(data.notifications),
    firewall: useState(data.firewallRules),
    commands: useState(data.botCommands),
    navigate,
  };
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useDashboard must be used inside <DashboardStore>");
  return ctx;
}

/** Same as useDashboard, but returns null outside the dashboard (e.g. the landing-page preview). */
export function useOptionalDashboard() {
  return useContext(StoreContext);
}
