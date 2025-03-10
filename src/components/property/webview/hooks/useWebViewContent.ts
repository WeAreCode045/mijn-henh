
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
  const { calculateTotalPages, isValidPageIndex, getSectionIndex } = usePageCalculation();
  const totalPages = calculateTotalPages(propertyData);
  
  // Reset to first page when property changes
  useEffect(() => {
    setCurrentPage(0);
  }, [propertyData?.id, setCurrentPage]);
  
  // Ensure currentPage is valid
  useEffect(() => {
    if (!isValidPageIndex(currentPage, propertyData)) {
      console.log("Invalid page index detected, resetting to 0");
      setCurrentPage(0);
    }
  }, [currentPage, propertyData, setCurrentPage, isValidPageIndex]);
  
  // Navigation functions
  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < totalPages - 1;
  
  const handleNext = () => {
    if (canGoForward) {
      const nextPage = currentPage + 1;
      console.log(`Navigating to next page: ${nextPage}`);
      
      if (isValidPageIndex(nextPage, propertyData)) {
        setCurrentPage(nextPage);
        // Scroll to top when changing page
        window.scrollTo(0, 0);
      } else {
        console.warn(`Cannot navigate to invalid page index: ${nextPage}`);
      }
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      const prevPage = currentPage - 1;
      console.log(`Navigating to previous page: ${prevPage}`);
      
      if (isValidPageIndex(prevPage, propertyData)) {
        setCurrentPage(prevPage);
        // Scroll to top when changing page
        window.scrollTo(0, 0);
      } else {
        console.warn(`Cannot navigate to invalid page index: ${prevPage}`);
      }
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
