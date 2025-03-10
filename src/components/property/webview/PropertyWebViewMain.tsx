
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
  return (
    <div className="w-full bg-white shadow-lg overflow-hidden h-full flex flex-col">
      <div ref={contentRef} className="flex-1 min-h-0">
        <PropertyWebViewContent 
          property={propertyData}
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
      {/* Hidden print content */}
      <div 
        ref={printContentRef}
        id="print-content" 
        className="fixed left-[-9999px] w-full"
      >
        <PropertyWebViewContent 
          property={propertyData}
          settings={settings}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleShare={handleShare}
          handlePrint={handlePrint}
          handleDownload={handleDownload}
          isPrintView={true}
          waitForPlaces={true}
        />
      </div>
    </div>
  );
}
