
import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

export function usePropertyTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const tabParam = searchParams.get('tab');
  
  // Valid tab values
  const validTabs = ['dashboard', 'content', 'media', 'communications'];
  
  // Default to dashboard tab if no valid tab is in URL
  const [activeTab, setActiveTab] = useState(
    validTabs.includes(tabParam || '') ? tabParam : 'dashboard'
  );
  
  // Update the URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', tab);
      return newParams;
    });
  };
  
  // Sync with URL parameters on mount and when URL changes
  useEffect(() => {
    // Check if URL ends with /edit and remove it if needed
    if (location.pathname.endsWith('/edit')) {
      const newPath = location.pathname.replace('/edit', '');
      window.history.replaceState(null, '', newPath + location.search);
    }

    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam, location.pathname]);
  
  return {
    activeTab,
    setActiveTab: handleTabChange,
  };
}
