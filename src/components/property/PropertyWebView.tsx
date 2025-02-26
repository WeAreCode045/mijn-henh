
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { usePropertyWebView } from "./webview/usePropertyWebView";
import { useNavigate, useParams } from "react-router-dom";
import { PropertyData } from "@/types/property";
import { Dispatch, SetStateAction, useRef } from "react";
import { PropertyWebViewDialog } from "./webview/PropertyWebViewDialog";
import { PropertyWebViewMain } from "./webview/PropertyWebViewMain";
import { PropertyBreadcrumb } from "./webview/PropertyBreadcrumb";
import { WebViewFooter } from "./webview/WebViewFooter";
import { usePropertyData } from "./webview/hooks/usePropertyData";
import { usePageCalculation } from "./webview/hooks/usePageCalculation";

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
  
  const { propertyData } = usePropertyData(id, property);
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

  if (!propertyData) {
    return <div>Loading...</div>;
  }

  const totalPages = calculateTotalPages(propertyData);

  if (typeof open !== 'undefined' && onOpenChange) {
    return (
      <PropertyWebViewDialog
        open={open}
        onOpenChange={onOpenChange}
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
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Fixed Breadcrumb */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <PropertyBreadcrumb 
            title={propertyData.title}
            onBack={() => navigate('/')}
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
                <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden h-full flex flex-col max-h-[calc(100vh-14rem)]">
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
