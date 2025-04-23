
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyWebViewContent } from "./PropertyWebViewContent";

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
  // Determine if header should be shown (hide on overview page)
  const showHeader = currentPage !== 0;

  return (
    <div className="w-full h-full">
      {/* Main visible content */}
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
