
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { usePropertyWebView } from "@/components/property/usePropertyWebView";
import { useNavigate, useParams } from "react-router-dom";
import { PropertyData } from "@/types/property";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { PropertyWebViewDialog } from "@/components/property/webview/PropertyWebViewDialog";
import { PropertyWebViewMain } from "@/components/property/webview/PropertyWebViewMain";
import { PropertyBreadcrumb } from "@/components/property/webview/PropertyBreadcrumb";
import { WebViewFooter } from "@/components/property/webview/WebViewFooter";
import { usePropertyData } from "@/components/property/webview/hooks/usePropertyData";
import { usePageCalculation } from "@/components/property/webview/hooks/usePageCalculation";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyWebViewProps {
  property?: PropertyData;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export function PropertyWebView({ property, open, onOpenChange }: PropertyWebViewProps = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useAgencySettings();
  const contentRef = useRef<HTMLDivElement>(null);
  const printContentRef = useRef<HTMLDivElement>(null);
  
  const { propertyData, isLoading, error } = usePropertyData(id, property);
  const { calculateTotalPages } = usePageCalculation();
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
  useEffect(() => {
    if (settings.webviewBackgroundUrl) {
      document.documentElement.style.setProperty(
        '--webview-bg-image', 
        `url(${settings.webviewBackgroundUrl})`
      );
    } else {
      document.documentElement.style.removeProperty('--webview-bg-image');
    }
  }, [settings.webviewBackgroundUrl]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !propertyData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800">Property Not Found</h1>
          <p className="text-gray-600">
            {error || "We couldn't find the property you're looking for. It may have been removed or the URL is incorrect."}
          </p>
          <div className="flex space-x-4 justify-center">
            <Button onClick={() => navigate('/properties')} variant="default">
              View All Properties
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = calculateTotalPages(propertyData);

  if (typeof open !== 'undefined' && onOpenChange) {
    return (
      <PropertyWebViewDialog
        propertyData={propertyData}
        isOpen={open} 
        open={open}
        onOpenChange={onOpenChange}
        settings={settings}
        contentRef={contentRef}
        printContentRef={printContentRef}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
        handlePrint={handlePrint}
        handleDownload={async () => {}}
      />
    );
  }

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/properties');
    }
  };

  // Apply primary color from settings to buttons and accent elements
  useEffect(() => {
    if (settings.primaryColor) {
      const hslColor = hexToHSL(settings.primaryColor);
      if (hslColor) {
        document.documentElement.style.setProperty('--estate-600', `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`);
        document.documentElement.style.setProperty('--estate-700', `${hslColor.h} ${hslColor.s}% ${Math.max(0, hslColor.l - 10)}%`);
      }
    }
  }, [settings.primaryColor]);

  return (
    <div className="min-h-screen webview-page relative">
      {/* Fixed Breadcrumb */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <PropertyBreadcrumb 
            title={propertyData.title}
            onBack={handleBackNavigation}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto min-h-screen overflow-hidden">
        <div className="flex flex-col items-center h-full pt-20 pb-24">
          {/* Container with padding */}
          <div className="w-full flex-1 px-4 sm:px-8 py-4">
            <div className="flex justify-center">
              <div className="w-full max-w-[800px] p-0 sm:p-4 h-full">
                <div className="webview-content rounded-xl overflow-hidden h-full flex flex-col max-h-[calc(100vh-14rem)]">
                  <div className="w-full flex-1 overflow-y-auto">
                    <PropertyWebViewMain
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
                      handleDownload={async () => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-estate-100 shadow-lg">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-[800px]">
              <WebViewFooter 
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShare={handleShare}
                onPrint={handlePrint}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert hex color to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.substring(0, 1).repeat(2), 16) / 255;
    g = parseInt(hex.substring(1, 2).repeat(2), 16) / 255;
    b = parseInt(hex.substring(2, 3).repeat(2), 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  } else {
    return null;
  }

  // Find min and max values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
}
