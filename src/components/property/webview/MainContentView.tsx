
import React from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyWebViewContent } from "./PropertyWebViewContent";

interface MainContentViewProps {
  contentRef: React.RefObject<HTMLDivElement>;
  propertyData: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleShare: (platform: string) => Promise<void>;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  showHeader?: boolean;
}

export function MainContentView({
  contentRef,
  propertyData,
  settings,
  currentPage,
  setCurrentPage,
  selectedImage,
  setSelectedImage,
  handleShare,
  handlePrint,
  handleDownload,
  showHeader = true
}: MainContentViewProps) {
  return (
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
        showHeader={showHeader}
      />
    </div>
  );
}
