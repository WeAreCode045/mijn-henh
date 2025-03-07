
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { WebViewHeader } from "./WebViewHeader";
import { PropertyWebViewMain } from "./PropertyWebViewMain";
import { WebViewFooter } from "./WebViewFooter";
import { usePageCalculation } from "./hooks/usePageCalculation";
import { MutableRefObject } from "react";

interface WebViewDialogContentProps {
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

  return (
    <div className="w-full h-full flex flex-col">
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
      <WebViewFooter 
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onShare={handleShare}
        onPrint={handlePrint}
      />
    </div>
  );
}
