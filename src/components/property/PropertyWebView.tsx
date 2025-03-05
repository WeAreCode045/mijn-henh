
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
    // Use the new URL structure
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
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
