import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { StatusPanel } from "@/components/dashboard/StatusPanel";
import { LazyMount } from "@/components/ui/LazyMount";
import { Skeleton } from "@/components/ui/Skeleton";

function SectionSkeleton({ blocks }: { blocks: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Skeleton className="h-4 w-40" />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: blocks }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardHeader />
      <KPIGrid />

      <LazyMount fallback={<SectionSkeleton blocks={2} />}>
        <AnalyticsSection />
      </LazyMount>

      <LazyMount fallback={<SectionSkeleton blocks={2} />}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActivityFeed />
          <StatusPanel />
        </div>
      </LazyMount>
    </div>
  );
}
