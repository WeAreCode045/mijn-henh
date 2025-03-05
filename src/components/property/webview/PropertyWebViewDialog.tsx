
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyData } from "@/types/property";
import { PropertyWebViewContent } from "./PropertyWebViewContent";
import { AgencySettings } from "@/types/agency";
import { useRef } from "react";

interface PropertyWebViewDialogProps {
  propertyData: PropertyData;
  isOpen: boolean;
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
