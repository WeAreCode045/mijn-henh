
import { useState } from 'react';

export function usePropertyTabs() {
  // Default to dashboard tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return {
    activeTab,
    setActiveTab,
  };
}
