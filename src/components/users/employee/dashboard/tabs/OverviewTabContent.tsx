
import { RecentProperties } from "../RecentProperties";
import { QuickActions } from "../QuickActions";
import { AnalyticsOverview } from "../AnalyticsOverview";

export function OverviewTabContent() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProperties />
        <QuickActions />
      </div>
      <AnalyticsOverview />
    </div>
  );
}
