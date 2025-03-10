
import React from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyWebViewContent } from "./PropertyWebViewContent";
import { getPrintStylesContent } from "./PrintStyles";

interface PrintContentViewProps {
  printContentRef: React.RefObject<HTMLDivElement>;
  propertyData: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleShare: (platform: string) => Promise<void>;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
}

export function PrintContentView({
  printContentRef,
  propertyData,
  settings,
  currentPage,
  setCurrentPage,
  selectedImage,
  setSelectedImage,
  handleShare,
  handlePrint,
  handleDownload
}: PrintContentViewProps) {
  return (
    <div 
      ref={printContentRef}
      id="print-content" 
      className="fixed left-[-9999px] w-full"
    >
      <style type="text/css" dangerouslySetInnerHTML={{ __html: getPrintStylesContent() }} />
      <PropertyWebViewContent 
        property={propertyData}
        settings={settings}
        isPrintView={true}
        waitForPlaces={true}
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
