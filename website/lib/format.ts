const numberFormat = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** Masks a secret, keeping a short recognisable prefix and the last four characters. */
export function maskSecret(secret: string, visiblePrefix = 8): string {
  if (secret.length <= visiblePrefix + 4) return "•".repeat(secret.length);
  return `${secret.slice(0, visiblePrefix)}${"•".repeat(16)}${secret.slice(-4)}`;
}

/** Masks the host part of an IPv4 address: 203.0.113.42 → 203.0.•••.•• */
export function maskIp(ip: string): string {
  const parts = ip.split(".");
  if (parts.length !== 4) return "•••.•••.•••.•••";
  return `${parts[0]}.${parts[1]}.•••.••`;
}
