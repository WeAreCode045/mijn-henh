
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { usePropertyWebView } from "@/components/property/usePropertyWebView";
import { useNavigate, useParams } from "react-router-dom";
import { PropertyData } from "@/types/property";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { usePropertyData } from "@/components/property/webview/hooks/usePropertyData";
import { WebViewLoading } from "@/components/property/webview/WebViewLoading";
import { WebViewError } from "@/components/property/webview/WebViewError";
import { WebViewDialogContent } from "@/components/property/webview/WebViewDialogContent";
import { WebViewFullPage } from "@/components/property/webview/WebViewFullPage";
import { useWebViewBackground } from "@/components/property/webview/hooks/useWebViewBackground";
import { hexToHSL } from "@/components/property/webview/utils/colorUtils";
import "./webview/styles/WebViewStyles.css";
import { useToast } from "@/components/ui/use-toast";

interface PropertyWebViewProps {
  property?: PropertyData;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  isDialog?: boolean;
}

export function PropertyWebView({ property, open, onOpenChange, isDialog = false }: PropertyWebViewProps = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useAgencySettings();
  const contentRef = useRef<HTMLDivElement>(null);
  const printContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Debugging the id parameter
  useEffect(() => {
    console.log("PropertyWebView - Received ID parameter:", id);
    console.log("PropertyWebView - Received property prop:", property?.id);
  }, [id, property]);
  
  const { propertyData, isLoading, error } = usePropertyData(id, property);
  
  useEffect(() => {
    if (error) {
      console.error("PropertyWebView - Error loading property data:", error);
      toast({
        title: "Error",
        description: "Failed to load property data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const {
    selectedImage,
    setSelectedImage,
    currentPage,
    setCurrentPage,
    handleShare,
    handlePrint,
    handleNext,
    handlePrevious
  } = usePropertyWebView();

  // Set webview background image from settings
  useWebViewBackground(settings);

  // Apply primary color from settings to buttons and accent elements
  useEffect(() => {
    if (settings.primaryColor) {
      const hslColor = hexToHSL(settings.primaryColor);
      if (hslColor) {
        document.documentElement.style.setProperty('--estate-600', `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`);
        document.documentElement.style.setProperty('--estate-700', `${hslColor.h} ${hslColor.s}% ${Math.max(0, hslColor.l - 10)}%`);
      }
    }
    
    // Cleanup function
    return () => {
      document.documentElement.style.removeProperty('--estate-600');
      document.documentElement.style.removeProperty('--estate-700');
    };
  }, [settings.primaryColor]);

  // Loading state
  if (isLoading) {
    return <WebViewLoading isDialog={isDialog} />;
  }

  // Error state
  if (error || !propertyData) {
    console.error("PropertyWebView - Error or no property data:", error);
    return <WebViewError error={error} isDialog={isDialog} />;
  }

  // If this is being rendered in a dialog
  if (isDialog && onOpenChange) {
    return (
      <WebViewDialogContent
        propertyData={propertyData}
        settings={settings}
        contentRef={contentRef}
        printContentRef={printContentRef}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
        handlePrint={handlePrint}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    );
  }

  // Full page view
  return (
    <WebViewFullPage
      propertyData={propertyData}
      settings={settings}
      contentRef={contentRef}
      printContentRef={printContentRef}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      handleShare={handleShare}
      handlePrint={handlePrint}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />
  );
}
