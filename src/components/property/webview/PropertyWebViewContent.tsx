
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "./config/sectionConfig";
import { ImagePreviewDialog } from "./components/ImagePreviewDialog";
import { WebViewHeader } from "./WebViewHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CSSProperties } from "react";

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

  const backgroundStyle: CSSProperties = 
    currentPage !== 0 && settings?.webviewBackgroundUrl 
      ? {
          backgroundImage: `url(${settings.webviewBackgroundUrl})`,
          backgroundSize: 'contain',
          backgroundPosition: 'right bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2,
          position: 'absolute' as const,
          bottom: -10,
          right: -120,
          width: '100%',
          height: '85%',
          zIndex: 0
        } 
      : {};

  return (
    <div className="flex flex-col h-full relative">
      {currentPage !== 0 && settings?.webviewBackgroundUrl && (
        <div style={backgroundStyle}></div>
      )}

      <div className="border-b flex-shrink-0 bg-white relative z-10">
        <WebViewHeader settings={settings} />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 relative z-10">
        <div className="p-4 pb-24">
          {sections[currentPage]?.content}
        </div>
      </div>

      <ImagePreviewDialog 
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {!isPrintView && (
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 border-t bg-opacity-95 z-10"
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
