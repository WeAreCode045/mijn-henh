
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function usePropertyTabs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Valid tab values and their corresponding paths
  const validTabs = ['dashboard', 'content', 'media', 'communications'];
  
  // Extract the current tab from the URL path
  const getTabFromPath = (path: string): string => {
    for (const tab of validTabs) {
      if (path.endsWith(`/${tab}`)) {
        return tab;
      }
    }
    // If no valid tab is found in the path, default to dashboard
    return 'dashboard';
  };
  
  // Get the initial active tab from the URL
  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  
  // Update the URL when tab changes
  const handleTabChange = (tab: string) => {
    if (!id) return;
    
    setActiveTab(tab);
    navigate(`/property/${id}/${tab}`, { replace: true });
  };
  
  // Sync with URL path changes
  useEffect(() => {
    const currentTab = getTabFromPath(location.pathname);
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname]);
  
  return {
    activeTab,
    setActiveTab: handleTabChange,
  };
}
