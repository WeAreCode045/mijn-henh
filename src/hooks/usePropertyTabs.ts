
import { useState } from "react";

/**
 * Hook for managing property tab state
 * 
 * @returns {Object} Tab state management object
 * @returns {string} activeTab - The currently active tab
 * @returns {Function} setActiveTab - Function to update the active tab
 */
export function usePropertyTabs() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return {
    activeTab,
    setActiveTab
  };
}
