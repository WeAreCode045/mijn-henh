
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyWebViewContent } from "./PropertyWebViewContent";

interface PropertyWebViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function PropertyWebViewDialog({
  open,
  onOpenChange,
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
}: PropertyWebViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[80vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Property View</DialogTitle>
        <div ref={contentRef} className="h-full overflow-hidden">
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
        {/* Hidden print content without footer and breadcrumbs */}
        <div 
          ref={printContentRef} 
          id="print-content"
          className="fixed left-[-9999px] w-[800px]"
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
      </DialogContent>
    </Dialog>
  );
}
