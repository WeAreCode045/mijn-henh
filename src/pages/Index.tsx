
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentProperties } from "@/components/dashboard/RecentProperties";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  </div>
);

export default function Index() {
  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-estate-800 mb-12">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <RecentProperties />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <RecentSubmissions />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <AnalyticsOverview />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
