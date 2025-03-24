import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyBreadcrumb } from "./PropertyBreadcrumb";
import { PropertyWebViewMain } from "./PropertyWebViewMain";
import { WebViewHeader } from "./WebViewHeader";
import { WebViewFooter } from "./WebViewFooter";
import { usePageCalculation } from "./hooks/usePageCalculation";
import { MutableRefObject } from "react";
import { useNavigate } from "react-router-dom";

interface WebViewFullPageProps {
  propertyData: PropertyData;
  settings: AgencySettings;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  printContentRef: MutableRefObject<HTMLDivElement | null>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleShare: (platform: string) => Promise<void>;
  handlePrint: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

export function WebViewFullPage({
  propertyData,
  settings,
  contentRef,
  printContentRef,
  currentPage,
  setCurrentPage,
  selectedImage,
  setSelectedImage,
  handleShare,
  handlePrint,
  handleNext,
  handlePrevious
}: WebViewFullPageProps) {
  const navigate = useNavigate();
  const { calculateTotalPages } = usePageCalculation();
  const totalPages = calculateTotalPages(propertyData);
  const showHeader = currentPage !== 0; // Hide header on overview page

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/properties');
    }
  };

  // Determine if we have a webview background from settings
  const containerStyle = settings?.webviewBackgroundUrl ? {
    backgroundImage: `url(${settings.webviewBackgroundUrl})`,
    backgroundSize: '47%',
    backgroundPosition: 'right -90px bottom',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10 px-4">
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
          
          {/* Navigation inside the container */}
          <div className="webview-sticky-footer">
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
  );
}
