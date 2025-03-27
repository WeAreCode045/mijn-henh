import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function useDashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  // Check for tab parameter in URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'properties', 'agenda', 'todos', 'comms', 'analytics', 'notifications', 'property'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (propertyId) {
      // If we have a property ID in the URL but no tab specified, we should show the property tab
      setActiveTab("property");
    }
  }, [searchParams, propertyId]);

  // Handle tab changes, updating the URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL with tab parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (value !== "property") {
      newSearchParams.set('tab', value);
      // Keep propertyId if it exists
      if (propertyId && value === "property") {
        newSearchParams.set('propertyId', propertyId);
      } else if (propertyId && value !== "property") {
        newSearchParams.delete('propertyId');
      }
      navigate({ search: newSearchParams.toString() });
    }
  };

  return {
    activeTab,
    handleTabChange,
    propertyId
  };
}
