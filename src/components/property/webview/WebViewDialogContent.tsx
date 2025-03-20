
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyWebViewMain } from "./PropertyWebViewMain";
import { WebViewHeader } from "./WebViewHeader";
import { WebViewFooter } from "./WebViewFooter";
import { usePageCalculation } from "./hooks/usePageCalculation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WebViewDialogContentProps {
  propertyData: PropertyData;
  settings: AgencySettings;
  contentRef: React.RefObject<HTMLDivElement>;
  printContentRef: React.RefObject<HTMLDivElement>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleShare: (platform: string) => Promise<void>;
  handlePrint: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

export function WebViewDialogContent({
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
}: WebViewDialogContentProps) {
  const { calculateTotalPages } = usePageCalculation();
  const totalPages = calculateTotalPages(propertyData);
  const navigate = useNavigate();
  const showHeader = currentPage !== 0; // Hide header on overview page

  // Determine if we have a webview background from settings
  const containerStyle = settings?.webviewBackgroundUrl ? {
    backgroundImage: `url(${settings.webviewBackgroundUrl})`,
    backgroundSize: 'contain',
    backgroundPosition: 'bottom right',
    backgroundRepeat: 'no-repeat'
  } : {};

  const handleOpenInNewTab = () => {
    // Use the simplified URL structure for the webview
    const webviewUrl = `/${propertyData.id}/webview`;
    window.open(webviewUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-semibold">Property Preview</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleOpenInNewTab}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open in New Tab
        </Button>
      </div>
      
      <div 
        className="flex-1 overflow-hidden bg-white rounded-md shadow-sm flex flex-col webview-container-dialog"
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
  );
}
