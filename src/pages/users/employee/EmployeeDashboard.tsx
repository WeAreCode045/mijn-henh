
import { DashboardTabs } from "@/components/users/employee/dashboard/DashboardTabs";
import { PropertyQuickNav } from "@/components/users/employee/dashboard/PropertyQuickNav";
import { ActivityIndicators } from "@/components/users/employee/dashboard/ActivityIndicators";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EmployeeDashboard() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Mark component as loaded to avoid issues with dynamic imports
    setIsLoaded(true);
    console.log("Employee Dashboard loaded successfully");
  }, []);
  
  return (
    <div className="container mx-auto pt-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="w-1/2">
          <PropertyQuickNav />
        </div>
        <div>
          <ActivityIndicators />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <DashboardTabs />
      </div>
    </div>
  );
}
