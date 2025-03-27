
import { PropertyQuickview } from "@/components/dashboard/PropertyQuickview";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { NotificationsBar } from "@/components/dashboard/NotificationsBar";
import { PropertyLayout } from "@/components/PropertyLayout";

export default function Index() {
  return (
    <PropertyLayout>
      <div className="container mx-auto pt-4 pb-8">
        {/* First row: Property Quickview and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <PropertyQuickview />
          </div>
          <div className="lg:col-span-1">
            <NotificationsBar />
          </div>
        </div>
        
        {/* Second row: Dashboard Tabs (full width) */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardTabs />
        </div>
      </div>
    </PropertyLayout>
  );
}
