
import { CompactNotificationsBar } from "@/components/dashboard/CompactNotificationsBar";
import { PropertyQuickNav } from "@/components/dashboard/PropertyQuickNav";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

export default function Index() {
  return (
    <div className="container mx-auto pt-4 pb-8">
      {/* First row: Three-column layout with notifications, property navigation, and quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left column: Compact Notifications Bar */}
        <div>
          <CompactNotificationsBar />
        </div>
        
        {/* Middle column: Property Quick Navigation */}
        <div>
          <PropertyQuickNav />
        </div>
        
        {/* Right column: Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>
      
      {/* Second row: Dashboard Tabs (full width) with a small gap between nav and content */}
      <div className="grid grid-cols-1 gap-6">
        <DashboardTabs />
      </div>
    </div>
  );
}
