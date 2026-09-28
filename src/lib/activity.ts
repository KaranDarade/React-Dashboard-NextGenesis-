export type ActivityStatus = "success" | "info" | "warning" | "error";

export interface ActivityEvent {
  id: string;
  at: number;
  action: string;
  detail?: string;
  actor: string;
  status: ActivityStatus;
}

/**
 * A real, client-side activity log. DummyJSON has no event stream, so instead
 * of faking backend events we record what genuinely happens in the app
 * (session, searches, filters, product views, create/edit/delete, refreshes).
 */
const MAX_EVENTS = 40;

let events: ActivityEvent[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ActivityEvent[] {
  return events;
}

const EMPTY: ActivityEvent[] = [];
function getServerSnapshot(): ActivityEvent[] {
  return EMPTY;
}

export interface LogInput {
  action: string;
  actor?: string;
  detail?: string;
  status?: ActivityStatus;
}

export function logActivity({
  action,
  actor = "You",
  detail,
  status = "info",
}: LogInput): void {
  const event: ActivityEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: Date.now(),
    action,
    detail,
    actor,
    status,
  };
  events = [event, ...events].slice(0, MAX_EVENTS);
  emit();
}

export function clearActivity(): void {
  events = [];
  emit();
}

export const activityStore = { subscribe, getSnapshot, getServerSnapshot };
