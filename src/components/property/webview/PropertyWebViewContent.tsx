
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "./config/sectionConfig";
import { useEffect, useState } from "react";
import { useContactForm } from "./hooks/useContactForm";
import { usePageCalculation } from "./hooks/usePageCalculation";
import { getPrintStylesContent } from "./PrintStyles";

interface PropertyWebViewContentProps {
  property: PropertyData;
  settings: AgencySettings;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  selectedImage?: string | null;
  setSelectedImage?: (image: string | null) => void;
  handleShare?: (platform: string) => Promise<void>;
  handlePrint?: () => void;
  handleDownload?: () => Promise<void>;
}

export function PropertyWebViewContent({
  property,
  settings,
  isPrintView = false,
  waitForPlaces = false,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
  selectedImage,
  setSelectedImage,
  handleShare,
  handlePrint,
  handleDownload
}: PropertyWebViewContentProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(0);
  const { calculateTotalPages } = usePageCalculation();
  const { formData, handleChange, handleSubmit, isSubmitting } = useContactForm(property);
  
  // Use external state if provided, otherwise use internal state
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  const setCurrentPageFn = externalSetCurrentPage || setInternalCurrentPage;
  
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
    setCurrentPageFn(0);
  }, [property?.id, setCurrentPageFn]);
  
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
      setCurrentPageFn(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentPageFn(currentPage - 1);
    }
  };
  
  // Handle form submission with the correct signature
  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  return (
    <div className="relative">
      {isPrintView && (
        <style type="text/css" dangerouslySetInnerHTML={{ __html: getPrintStylesContent() }} />
      )}
      
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
