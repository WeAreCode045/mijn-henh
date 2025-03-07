
import { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { usePageCalculation } from "./usePageCalculation";

export function useWebViewContent({
  propertyData,
  currentPage,
  setCurrentPage
}: {
  propertyData: PropertyData;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const { calculateTotalPages } = usePageCalculation();
  const totalPages = calculateTotalPages(propertyData);
  
  // Reset to first page when property changes
  useEffect(() => {
    setCurrentPage(0);
  }, [propertyData?.id, setCurrentPage]);
  
  // Navigation functions
  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < totalPages - 1;
  
  const handleNext = () => {
    if (canGoForward) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Function to conditionally log when in development/debug
  const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WebView: ${message}`, data);
    }
  };

  return {
    totalPages,
    canGoBack,
    canGoForward,
    handleNext,
    handlePrevious,
    debugLog
  };
}
