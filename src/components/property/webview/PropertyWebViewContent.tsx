
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { useState } from "react";
import { getPrintStylesContent } from "./PrintStyles";
import { WebViewSectionContent } from "./components/WebViewSectionContent";

interface PropertyWebViewContentProps {
  property: PropertyData;
  settings: AgencySettings;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  selectedImage?: string | null;
  setSelectedImage?: (image: string | null) => void;
  handleShare?: (platform: string) => Promise<void>;
  handlePrint?: () => void;
  handleDownload?: () => Promise<void>;
  showHeader?: boolean;
}

export function PropertyWebViewContent({
  property,
  settings,
  isPrintView = false,
  waitForPlaces = false,
  currentPage = 0,
  setCurrentPage,
  selectedImage,
  setSelectedImage,
  handleShare,
  handlePrint,
  handleDownload,
  showHeader = true
}: PropertyWebViewContentProps) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      {isPrintView && (
        <style type="text/css" dangerouslySetInnerHTML={{ __html: getPrintStylesContent() }} />
      )}
      
      <WebViewSectionContent 
        property={property}
        settings={settings}
        currentPage={currentPage}
        isPrintView={isPrintView}
        waitForPlaces={waitForPlaces}
        showHeader={showHeader}
      />
    </div>
  );
}
