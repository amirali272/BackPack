import type { SVGProps } from "react";

/**
 * Custom two-tone service icons on a 24px grid: a neutral 1.5px outline with
 * a single accent element in the brand green.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

const accent = { stroke: "#00FF88" } as const;

export function HostingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4" width="17" height="7" rx="2" />
      <rect x="3.5" y="13" width="17" height="7" rx="2" />
      <path d="M11 7.5h6M11 16.5h6" opacity=".5" />
      <circle cx="7" cy="7.5" r="1" fill="#00FF88" stroke="none" />
      <circle cx="7" cy="16.5" r="1" fill="#00FF88" stroke="none" />
    </Base>
  );
}

export function ServerManageIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 8h18" opacity=".5" />
      <path d="M7 12l2.5 2L7 16" {...accent} />
      <path d="M12 16h5" />
    </Base>
  );
}

export function WebSecurityIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" opacity=".5" />
      <path d="M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5z" />
      <path d="M17.5 17.5l3 3" {...accent} />
      <circle cx="16" cy="16" r="2.2" {...accent} />
    </Base>
  );
}

export function ApiIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 4.5c-1.9 0-2.8.9-2.8 2.8v2c0 1.2-.8 2.7-2 2.7 1.2 0 2 1.5 2 2.7v2c0 1.9.9 2.8 2.8 2.8" />
      <path d="M16 4.5c1.9 0 2.8.9 2.8 2.8v2c0 1.2.8 2.7 2 2.7-1.2 0-2 1.5-2 2.7v2c0 1.9-.9 2.8-2.8 2.8" />
      <rect x="10" y="10" width="4" height="4" rx=".8" transform="rotate(45 12 12)" fill="#00FF88" stroke="none" />
    </Base>
  );
}

export function AutomationIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.6" />
      <rect x="14.5" y="14.5" width="6" height="6" rx="1.6" />
      <path d="M9.5 6.5h4a4 4 0 0 1 4 4v4" {...accent} />
      <path d="M15.5 12.5l2 2 2-2" {...accent} />
      <path d="M3.5 17.5h5" opacity=".5" />
    </Base>
  );
}

export function BotIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5v-8A2.5 2.5 0 0 1 6.5 4z" />
      <circle cx="9.5" cy="10.5" r="1.1" fill="#00FF88" stroke="none" />
      <circle cx="14.5" cy="10.5" r="1.1" fill="#00FF88" stroke="none" />
    </Base>
  );
}

export function MonitoringIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2.5" />
      <path d="M9 21h6M12 17v4" opacity=".5" />
      <path d="M6 11h2.5l1.5-2.5 2.5 5 1.5-2.5H18" {...accent} />
    </Base>
  );
}

export function BackupIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.2 13.5A8 8 0 1 0 6.3 6.3" />
      <path d="M4 3.5v4h4" />
      <path d="M12 8v4.2l2.8 1.8" {...accent} />
    </Base>
  );
}
