
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "./config/sectionConfig";
import { ImagePreviewDialog } from "./components/ImagePreviewDialog";
import { WebViewHeader } from "./WebViewHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyWebViewContentProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleShare: (platform: string) => Promise<void>;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
}

export function PropertyWebViewContent({
  property,
  settings,
  currentPage,
  setCurrentPage,
  selectedImage,
  setSelectedImage,
  handleShare,
  handlePrint,
  handleDownload,
  isPrintView = false,
  waitForPlaces = false
}: PropertyWebViewContentProps) {
  const sections = getSections({ 
    property, 
    settings, 
    currentPage, 
    isPrintView,
    waitForPlaces
  });

  const handleNext = () => {
    if (currentPage < sections.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Apply background image to all pages except Overview (page 0)
  const backgroundStyle = 
    currentPage !== 0 && settings?.webviewBackgroundUrl 
      ? {
          backgroundImage: `url(${settings.webviewBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        } 
      : {};

  return (
    <div className="flex flex-col h-full" style={backgroundStyle}>
      {/* Header */}
      <div className="border-b flex-shrink-0 bg-white">
        <WebViewHeader settings={settings} />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 pb-24">
          {sections[currentPage]?.content}
        </div>
      </div>

      <ImagePreviewDialog 
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Fixed Navigation Footer */}
      {!isPrintView && (
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 border-t bg-opacity-95"
          style={{ backgroundColor: settings?.primaryColor || '#9b87f5' }}
        >
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex flex-col items-center">
              <span className="font-semibold text-white">
                {sections[currentPage]?.title}
              </span>
              <span className="text-white/80 text-sm">
                Page {currentPage + 1} of {sections.length}
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={currentPage === sections.length - 1}
              className="text-white hover:bg-white/20"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
