export type ConnectionStatus =
  | "operational"
  | "syncing"
  | "degraded"
  | "offline";

export const CONNECTION_LABEL: Record<ConnectionStatus, string> = {
  operational: "Operational",
  syncing: "Syncing",
  degraded: "Degraded",
  offline: "Offline",
};

export const CONNECTION_TONE: Record<
  ConnectionStatus,
  "success" | "info" | "warning" | "danger"
> = {
  operational: "success",
  syncing: "info",
  degraded: "warning",
  offline: "danger",
};

export function relativeTime(timestamp: number, now: number): string {
  const diff = Math.max(0, now - timestamp);
  const seconds = Math.round(diff / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
