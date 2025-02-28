
import { useState } from "react";

export function usePropertyTabs() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return {
    activeTab,
    setActiveTab
  };
}
