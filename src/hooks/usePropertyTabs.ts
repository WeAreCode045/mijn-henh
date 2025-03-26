
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function usePropertyTabs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Valid tab values and their corresponding paths
  const validTabs = useMemo(() => ['dashboard', 'content', 'media', 'communications'], []);
  
  // Extract the current tab from the URL path
  const getTabFromPath = useCallback((path: string): string => {
    for (const tab of validTabs) {
      if (path.includes(`/${tab}`)) {
        return tab;
      }
    }
    return 'dashboard';
  }, [validTabs]);
  
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
    if (id && (location.pathname === `/property/${id}` || location.pathname === `/property/${id}/`)) {
      navigate(`/property/${id}/dashboard`);
    }
  }, [location.pathname, activeTab, id, navigate, getTabFromPath]);
  
  return {
    activeTab,
    setActiveTab: handleTabChange,
  };
}
