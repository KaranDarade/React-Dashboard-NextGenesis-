"use client";

import { createContext, useContext } from "react";
import { useActivity } from "@/hooks/useActivity";
import {
  useCatalogSnapshot,
  type CatalogSnapshotValue,
} from "@/hooks/useCatalogSnapshot";
import type { ActivityEvent, LogInput } from "@/lib/activity";
import { useProductOverrides } from "@/store/ProductOverridesContext";

interface ActivityValue {
  events: ActivityEvent[];
  log: (input: LogInput) => void;
  clear: () => void;
}

const CatalogContext = createContext<CatalogSnapshotValue | null>(null);
const ActivityContext = createContext<ActivityValue | null>(null);

export function DashboardDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useProductOverrides();
  const catalog = useCatalogSnapshot(state);
  const activity = useActivity();

  return (
    <CatalogContext.Provider value={catalog}>
      <ActivityContext.Provider value={activity}>
        {children}
      </ActivityContext.Provider>
    </CatalogContext.Provider>
  );
}

export function useDashboardData(): CatalogSnapshotValue {
  const value = useContext(CatalogContext);
  if (!value) {
    throw new Error(
      "useDashboardData must be used inside a DashboardDataProvider",
    );
  }
  return value;
}

export function useDashboardActivity(): ActivityValue {
  const value = useContext(ActivityContext);
  if (!value) {
    throw new Error(
      "useDashboardActivity must be used inside a DashboardDataProvider",
    );
  }
  return value;
}
