
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "./config/sectionConfig";
import { useEffect, useState } from "react";
import { useContactForm } from "./hooks/useContactForm";
import { usePageCalculation } from "./hooks/usePageCalculation";
import { getPrintStylesContent } from "./PrintStyles";
import { Button } from "@/components/ui/button";

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
  const { formData, handleChange, handleSubmit, isSubmitting } = useContactForm(property, settings);
  
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
  
  // Correctly match the handleSubmit signature from useContactForm
  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  return (
    <div className="relative p-6">
      {isPrintView && (
        <style type="text/css" dangerouslySetInnerHTML={{ __html: getPrintStylesContent() }} />
      )}
      
      <div className="webview-section p-4 mb-8">
        {sections[currentPage]?.content}
      </div>
    </div>
  );
}
