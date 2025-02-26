
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

  return (
    <>
      <div className="flex flex-col h-full max-h-full">
        {/* Header */}
        <div className="border-b flex-shrink-0">
          <WebViewHeader settings={settings} />
        </div>

        {/* Content Section - Make it scrollable */}
        <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400">
          <div className="p-4">
            {sections[currentPage]?.content}
          </div>
        </div>

        <ImagePreviewDialog 
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>

      {/* Fixed Navigation Footer - Outside the content container */}
      {!isPrintView && (
        <div 
          className="fixed bottom-0 left-0 right-0 p-4 border-t z-10"
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
    </>
  );
}
