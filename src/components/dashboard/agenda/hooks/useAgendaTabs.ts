
import { useState } from "react";

export function useAgendaTabs(initialTab: string = "list") {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  return {
    activeTab,
    setActiveTab
  };
}
