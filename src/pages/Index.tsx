
import { useState } from "react";
import { PropertyQuickview } from "@/components/dashboard/PropertyQuickview";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { NotificationsBar } from "@/components/dashboard/NotificationsBar";

export default function Index() {
  return (
    <div className="container mx-auto pt-4 pb-8">
      {/* First row: Property Quickview and User Profile */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        <div className="col-span-4">
          <PropertyQuickview />
        </div>
        <div className="col-span-1">
          <UserProfileCard />
        </div>
      </div>
      
      {/* Second row: Dashboard Tabs and Notifications */}
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-5">
          <DashboardTabs />
        </div>
        <div className="col-span-1">
          <NotificationsBar />
        </div>
      </div>
    </div>
  );
}
