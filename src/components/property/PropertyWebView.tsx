
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/property";
import { useState, useEffect, useRef } from "react";
import { usePropertyData } from "./webview/hooks/usePropertyData";
import { WebViewLoading } from "./webview/WebViewLoading";
import { WebViewError } from "./webview/WebViewError";
import { PropertyBreadcrumb } from "./webview/PropertyBreadcrumb";
import { WebViewHeader } from "./webview/WebViewHeader";
import { WebViewFooter } from "./webview/WebViewFooter";
import { PropertyWebViewContent } from "./webview/PropertyWebViewContent";
import { useWebViewBackground } from "./webview/hooks/useWebViewBackground";
import { hexToHSL } from "./webview/utils/colorUtils";
import { usePageCalculation } from "./webview/hooks/usePageCalculation";
import "./webview/styles/WebViewStyles.css";

interface PropertyWebViewProps {
  property?: PropertyData;
  isAdminView?: boolean;
}

export function PropertyWebView({ property, isAdminView = false }: PropertyWebViewProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useAgencySettings();
  const contentRef = useRef<HTMLDivElement>(null);
  const printContentRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Debugging the id parameter
  useEffect(() => {
    console.log("PropertyWebView - Received ID parameter:", id);
    console.log("PropertyWebView - Received property prop:", property?.id);
  }, [id, property]);
  
  const { propertyData, isLoading, error } = usePropertyData(id, property);
  const { calculateTotalPages } = usePageCalculation();
  
  // WebView controls
  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/share/${propertyData?.id || id}`;
    const text = `Check out this property: `;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent('Property')}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    // Placeholder for future download functionality
    console.log("Download functionality not yet implemented");
  }

  const handleNext = () => {
    if (propertyData) {
      const totalPages = calculateTotalPages(propertyData);
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle back navigation for admin view
  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/properties');
    }
  };

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
    return <WebViewLoading />;
  }

  // Error state
  if (error || !propertyData) {
    console.error("PropertyWebView - Error or no property data:", error);
    return <WebViewError error={error} />;
  }

  // Determine if we have a webview background from settings
  const containerStyle = settings?.webviewBackgroundUrl ? {
    backgroundImage: `url(${settings.webviewBackgroundUrl})`,
    backgroundSize: '47%',
    backgroundPosition: 'right -90px bottom',
    backgroundRepeat: 'no-repeat'
  } : {};

  // Show header only after the overview page
  const showHeader = currentPage !== 0;
  const totalPages = calculateTotalPages(propertyData);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10 px-4">
      {/* Fixed Breadcrumb - only shown in admin view */}
      {isAdminView && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <PropertyBreadcrumb 
              title={propertyData.title}
              onBack={handleBackNavigation}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="webview-container-wrapper">
        <div 
          className="webview-container-main flex flex-col rounded-xl overflow-hidden shadow-lg"
          style={containerStyle}
        >
          <div className="webview-sticky-header">
            <WebViewHeader 
              property={propertyData}
              settings={settings}
              showHeader={showHeader}
            />
          </div>
          
          <div className="webview-scrollable-content">
            <div ref={contentRef} className="flex-1 min-h-0">
              <PropertyWebViewContent 
                property={propertyData}
                settings={settings}
                currentPage={currentPage}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                handleShare={handleShare}
                handlePrint={handlePrint}
                handleDownload={handleDownload}
                showHeader={showHeader}
                waitForPlaces={false}
                isPrintView={false}
              />
            </div>
          </div>
          
          {/* Navigation inside the container */}
          <div className="webview-sticky-footer">
            <WebViewFooter 
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onShare={handleShare}
              onPrint={handlePrint}
              isAdminView={isAdminView}
            />
          </div>
        </div>
      </div>

      {/* Hidden print content */}
      <div 
        ref={printContentRef} 
        className="hidden print:block" 
        style={{ width: '100%' }}
      >
        <PropertyWebViewContent 
          property={propertyData}
          settings={settings}
          isPrintView={true}
          currentPage={currentPage}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleShare={handleShare}
          handlePrint={handlePrint}
          handleDownload={handleDownload}
          showHeader={true}
        />
      </div>
    </div>
  );
}
