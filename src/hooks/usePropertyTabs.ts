
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function usePropertyTabs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Valid tab values and their corresponding paths
  const validTabs = ['dashboard', 'content', 'media', 'communications'];
  
  // Extract the current tab from the URL path
  const getTabFromPath = (path: string): string => {
    // Check if the path includes one of our valid tabs
    for (const tab of validTabs) {
      if (path.includes(`/${tab}`)) {
        return tab;
      }
    }
    // If no valid tab is found in the path, default to dashboard
    return 'dashboard';
  };
  
  // Get the initial active tab from the URL
  const [activeTab, setActiveTab] = useState<string>(getTabFromPath(location.pathname));
  
  // Update the URL when tab changes
  const handleTabChange = useCallback((tab: string) => {
    if (!id) {
      console.warn("No property ID available for tab navigation");
      return;
    }
    
    console.log(`Changing tab to: ${tab}`);
    // First update the state
    setActiveTab(tab);
    
    // Then navigate to the correct route
    navigate(`/property/${id}/${tab}`);
  }, [id, navigate]);
  
  // Sync with URL path changes
  useEffect(() => {
    const currentTab = getTabFromPath(location.pathname);
    if (currentTab !== activeTab) {
      console.log(`Syncing tab state from URL: ${currentTab}`);
      setActiveTab(currentTab);
    }
    
    // If there's no specific tab in the URL (just /property/id), redirect to dashboard
    if (id && (location.pathname === `/property/${id}` || location.pathname === `/property/${id}/`)) {
      console.log("Redirecting to dashboard tab");
      navigate(`/property/${id}/dashboard`);
    }
  }, [location.pathname, activeTab, id, navigate]);
  
  return {
    activeTab,
    setActiveTab: handleTabChange,
    validTabs
  };
}
