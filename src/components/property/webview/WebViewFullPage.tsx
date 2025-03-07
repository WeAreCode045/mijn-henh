
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

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-estate-50">
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
      <div className="container mx-auto min-h-screen flex flex-col items-center pt-20 pb-4 px-4">
        <div className="w-full max-w-4xl webview-content rounded-xl overflow-hidden shadow-lg flex flex-col">
          <WebViewHeader 
            property={propertyData}
            settings={settings}
          />
          
          <div className="flex-1 overflow-y-auto">
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
          
          {/* Navigation moved inside the container */}
          <div className="p-4 border-t">
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
