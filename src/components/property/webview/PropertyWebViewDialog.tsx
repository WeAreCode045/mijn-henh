
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyWebViewContent } from "./PropertyWebViewContent";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { useRef } from "react";

interface PropertyWebViewDialogProps {
  propertyData: PropertyData;
  isOpen: boolean;
  open?: boolean; // Add this for compatibility
  onOpenChange: (open: boolean) => void;
  settings?: AgencySettings;
  contentRef?: React.RefObject<HTMLDivElement>;
  printContentRef?: React.RefObject<HTMLDivElement>;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  selectedImage?: string | null;
  setSelectedImage?: (image: string | null) => void;
  handleShare?: (platform: string) => Promise<void>;
  handlePrint?: () => void;
  handleDownload?: () => Promise<void>;
}

export function PropertyWebViewDialog({ 
  propertyData, 
  isOpen, 
  open,
  onOpenChange,
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
  const defaultContentRef = useRef<HTMLDivElement>(null);
  const defaultPrintContentRef = useRef<HTMLDivElement>(null);
  
  // Use 'open' prop if provided, otherwise use 'isOpen'
  const dialogOpen = open !== undefined ? open : isOpen;
  
  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <PropertyWebViewContent 
            property={propertyData}
            settings={settings || {} as AgencySettings}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            handleShare={handleShare}
            handlePrint={handlePrint}
            handleDownload={handleDownload}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
