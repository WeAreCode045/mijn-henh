
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
  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  
  // Update the URL when tab changes
  const handleTabChange = (tab: string) => {
    if (!id) return;
    
    setActiveTab(tab);
    // Navigate to the correct route
    navigate(`/property/${id}/${tab}`);
  };
  
  // Sync with URL path changes
  useEffect(() => {
    const currentTab = getTabFromPath(location.pathname);
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
    
    // If there's no specific tab in the URL (just /property/id), redirect to dashboard
    if (id && location.pathname === `//property/${id}` || location.pathname === `/property/${id}`) {
      navigate(`/property/${id}/dashboard`);
    }
  }, [location.pathname, activeTab, id, navigate]);
  
  return {
    activeTab,
    setActiveTab: handleTabChange,
  };
}
