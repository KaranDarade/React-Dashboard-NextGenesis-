"use client";

import { useSyncExternalStore } from "react";
import { activityStore, clearActivity, logActivity } from "@/lib/activity";

export function useActivity() {
  const events = useSyncExternalStore(
    activityStore.subscribe,
    activityStore.getSnapshot,
    activityStore.getServerSnapshot,
  );

  return { events, log: logActivity, clear: clearActivity };
}
