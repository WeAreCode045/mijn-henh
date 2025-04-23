
import { PropertyData } from "@/types/property";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useState, useRef } from "react";
import { PropertyWebViewContent } from "./PropertyWebViewContent";

interface WebViewDialogContentProps {
  propertyData: PropertyData;
}

export function WebViewDialogContent({ propertyData }: WebViewDialogContentProps) {
  const { settings } = useAgencySettings();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Function stubs for the actions (simplified for dialog view)
  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/share/${propertyData.id}`;
    console.log(`Sharing URL ${shareUrl} via ${platform}`);
  };
  
  const handlePrint = () => {
    console.log("Print functionality triggered");
  };
  
  const handleDownload = async () => {
    console.log("Download functionality triggered");
  };

  return (
    <div className="w-full h-full overflow-auto">
      <PropertyWebViewContent 
        property={propertyData}
        settings={settings}
        currentPage={currentPage}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
        showHeader={true}
        isPrintView={false}
        waitForPlaces={false}
      />
    </div>
  );
}
