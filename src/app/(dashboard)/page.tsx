import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentProducts } from "@/components/dashboard/RecentProducts";
import { LazyMount } from "@/components/ui/LazyMount";
import { Skeleton } from "@/components/ui/Skeleton";

function BlockSkeleton({ rows }: { rows: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Skeleton className="h-4 w-40" />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: rows * 2 }).map((_, index) => (
          <Skeleton key={index} className="h-36 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <GreetingHeader />
      <KPIGrid />

      <LazyMount fallback={<BlockSkeleton rows={2} />}>
        <AnalyticsSection />
      </LazyMount>

      <LazyMount fallback={<BlockSkeleton rows={1} />}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentProducts />
          </div>
          <RecentActivity />
        </div>
      </LazyMount>
    </div>
  );
}
