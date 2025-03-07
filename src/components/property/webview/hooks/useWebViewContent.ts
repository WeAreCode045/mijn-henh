
import { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

export function useWebViewContent({
  propertyData,
  currentPage,
  setCurrentPage
}: {
  propertyData: PropertyData;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  // Reset to first page when property changes
  useEffect(() => {
    setCurrentPage(0);
  }, [propertyData?.id, setCurrentPage]);
  
  // Function to conditionally log when in development/debug
  const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WebView: ${message}`, data);
    }
  };

  return {
    debugLog
  };
}
