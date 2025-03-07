
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
              <div className="w-full max-w-[1000px] p-0 sm:p-4 h-full">
                <div className="webview-content rounded-xl overflow-hidden h-full flex flex-col max-h-[calc(100vh-14rem)]">
                  <WebViewHeader 
                    property={propertyData}
                    settings={settings}
                  />
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
            <div className="w-full max-w-[1000px]">
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
