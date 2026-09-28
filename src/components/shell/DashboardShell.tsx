"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { MobileNavDrawer } from "@/components/shell/MobileNavDrawer";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { usePersistedBoolean } from "@/hooks/usePersistedBoolean";
import { useStoredUser } from "@/hooks/useStoredUser";
import {
  DashboardDataProvider,
  useDashboardActivity,
} from "@/store/DashboardDataContext";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardDataProvider>
      <ShellFrame>{children}</ShellFrame>
    </DashboardDataProvider>
  );
}

function ShellFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = usePersistedBoolean(
    "ng_sidebar_collapsed",
    false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useStoredUser();
  const { log } = useDashboardActivity();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    log({
      action: "Session started",
      detail: user ? `${user.firstName} ${user.lastName}` : "Guest session",
      actor: user?.firstName ?? "System",
      status: "success",
    });
  }, [log, user]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <MobileNavDrawer
        open={mobileOpen}
        onClose={closeMobile}
        pathname={pathname}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNav={() => setMobileOpen(true)} />
        <DemoBanner />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-14 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
