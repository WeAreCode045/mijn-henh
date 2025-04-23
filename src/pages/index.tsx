
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { PropertyQuickNav } from "@/components/dashboard/PropertyQuickNav";
import { ActivityIndicators } from "@/components/dashboard/ActivityIndicators";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Index() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Mark component as loaded to avoid issues with dynamic imports
    setIsLoaded(true);
    console.log("Index page loaded successfully");
  }, []);
  
  return (
    <div className="container mx-auto pt-4 pb-8">
      {/* Top nav section with search and activity indicators */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-1/2">
          <PropertyQuickNav />
        </div>
        <div>
          <ActivityIndicators />
        </div>
      </div>
      
      {/* Dashboard Tabs (full width) */}
      <div className="grid grid-cols-1 gap-6">
        <DashboardTabs />
      </div>
    </div>
  );
}
