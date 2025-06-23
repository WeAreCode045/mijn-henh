
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useDashboardTabs() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabChange,
    propertyId,
  };
}
