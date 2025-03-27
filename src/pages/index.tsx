
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { NotificationsBar } from "@/components/dashboard/NotificationsBar";

export default function Index() {
  return (
    <div className="container mx-auto pt-4 pb-8">
      {/* First row: Notifications (full width) */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <NotificationsBar />
      </div>
      
      {/* Second row: Dashboard Tabs (full width) */}
      <div className="grid grid-cols-1 gap-6">
        <DashboardTabs />
      </div>
    </div>
  );
}
