
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";
import { RecentProperties } from "@/components/dashboard/RecentProperties";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { AgendaSection } from "@/components/dashboard/AgendaSection";

export default function Index() {
  return (
    <div className="container mx-auto pt-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsOverview />
        <RecentProperties />
        <RecentSubmissions />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgendaSection />
      </div>
    </div>
  );
}
