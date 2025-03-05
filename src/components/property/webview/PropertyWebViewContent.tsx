
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "./config/sectionConfig";
import { useEffect, useState } from "react";
import { useContactForm } from "./hooks/useContactForm";
import { usePageCalculation } from "./hooks/usePageCalculation";
import { getPrintStyles } from "./PrintStyles";

interface PropertyWebViewContentProps {
  property: PropertyData;
  settings: AgencySettings;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
}

export function PropertyWebViewContent({
  property,
  settings,
  isPrintView = false,
  waitForPlaces = false
}: PropertyWebViewContentProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const { calculateTotalPages } = usePageCalculation();
  const { formData, handleChange, handleSubmit, isSubmitting } = useContactForm(property);
  const totalPages = calculateTotalPages(property, isPrintView);
  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < totalPages - 1;
  
  // Function to conditionally log when in development/debug
  const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`WebView: ${message}`, data);
    }
  };
  
  debugLog('PropertyWebViewContent rendered', { 
    property: property?.id, 
    currentPage, 
    isPrintView 
  });
  
  // Reset to first page when property changes
  useEffect(() => {
    setCurrentPage(0);
  }, [property?.id]);
  
  // Get sections based on the current property and page
  const sections = getSections({ 
    property, 
    settings, 
    currentPage,
    waitForPlaces,
    isPrintView
  });

  const handleNext = () => {
    if (canGoForward) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="relative">
      {isPrintView && getPrintStyles()}
      
      {sections[currentPage]?.content}
      
      <div className="mt-8 flex justify-between items-center">
        <button 
          onClick={handlePrevious} 
          disabled={!canGoBack}
          className={`px-4 py-2 rounded ${canGoBack 
            ? 'bg-estate-600 text-white hover:bg-estate-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        <button 
          onClick={handleNext} 
          disabled={!canGoForward}
          className={`px-4 py-2 rounded ${canGoForward 
            ? 'bg-estate-600 text-white hover:bg-estate-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
