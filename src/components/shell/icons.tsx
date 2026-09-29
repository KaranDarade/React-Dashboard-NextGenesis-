import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 10.8 12 4l8 6.8" />
      <path d="M6 9.6V20h12V9.6" />
      <path d="M10 20v-5h4v5" />
    </Base>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
    </Base>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 12.5 12.5 20 4 11.5V4h7.5L20 12.5Z" />
      <circle cx="8" cy="8" r="1.3" />
    </Base>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Base>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </Base>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4.5 18h15L18 15.5Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </Base>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="m15.5 15.5 4 4" />
    </Base>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m14 6-6 6 6 6" />
    </Base>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m6 9 6 6 6-6" />
    </Base>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </Base>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 11a8 8 0 1 0-.7 4.6" />
      <path d="M20 5v6h-6" />
    </Base>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5 13.6 8 18 9.6 13.6 11.2 12 15.7 10.4 11.2 6 9.6 10.4 8 12 3.5Z" />
      <path d="m18.5 15.5.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </Base>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 12h3l2.5-6 4 12 2.5-6h4" />
    </Base>
  );
}

export function BarChartIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 20V10M12 20V4M19 20v-6" />
    </Base>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m5 13 4 4 10-10" />
    </Base>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </Base>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m12 4 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </Base>
  );
}

export function ServerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </Base>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.5 2.6 2.5 13.4 0 16-2.5-2.6-2.5-13.4 0-16Z" />
    </Base>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2l3 1.8" />
    </Base>
  );
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m4 16 5-5 3 3 7-7" />
      <path d="M15 7h5v5" />
    </Base>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="8" height="10" rx="2" />
      <rect x="13" y="3" width="8" height="6" rx="2" />
      <rect x="13" y="11" width="8" height="10" rx="2" />
      <rect x="3" y="15" width="8" height="6" rx="2" />
    </Base>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </Base>
  );
}

export function MoreHorizontalIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </Base>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </Base>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </Base>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </Base>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8L6.7 20l1-6L3.4 9.9 9.4 9 12 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Base>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </Base>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </Base>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Base>
  );
}

export function RowsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Base>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m10 6 6 6-6 6" />
    </Base>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </Base>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </Base>
  );
}

export function StoreFlowMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="sf-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="#0b100d" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        fill="none"
        stroke="rgba(34,197,94,0.35)"
      />
      <circle cx="16" cy="16" r="7" fill="none" stroke="url(#sf-mark)" strokeWidth="2" />
      <circle cx="16" cy="16" r="2.4" fill="url(#sf-mark)" />
    </svg>
  );
}
