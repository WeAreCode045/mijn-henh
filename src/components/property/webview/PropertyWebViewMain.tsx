
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { MainContentView } from "./MainContentView";
import { PrintContentView } from "./PrintContentView";
import { useWebViewContent } from "./hooks/useWebViewContent";

interface PropertyWebViewMainProps {
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
  handleDownload: () => Promise<void>;
}

export function PropertyWebViewMain({
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
  handleDownload
}: PropertyWebViewMainProps) {
  // Use the custom hook for content-related logic
  const { debugLog } = useWebViewContent({
    propertyData,
    currentPage,
    setCurrentPage
  });
  
  debugLog('PropertyWebViewMain rendered', { 
    property: propertyData?.id, 
    currentPage
  });

  // Determine if header should be shown (hide on overview page)
  const showHeader = currentPage !== 0;

  return (
    <div className="w-full h-full">
      {/* Main visible content */}
      <MainContentView 
        contentRef={contentRef}
        propertyData={propertyData}
        settings={settings}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
        showHeader={showHeader}
      />
      
      {/* Hidden print content */}
      <PrintContentView 
        printContentRef={printContentRef}
        propertyData={propertyData}
        settings={settings}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
    </div>
  );
}
