
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyWebViewContent } from "./PropertyWebViewContent";
import { WebViewHeader } from "./WebViewHeader";
import { WebViewFooter } from "./WebViewFooter";
import { usePageCalculation } from "./hooks/usePageCalculation";

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
  const { calculateTotalPages } = usePageCalculation();
  
  // Use 'open' prop if provided, otherwise use 'isOpen'
  const dialogOpen = open !== undefined ? open : isOpen;
  
  // Calculate total pages for footer navigation
  const totalPages = settings && propertyData ? calculateTotalPages(propertyData) : 0;
  
  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[95vh] overflow-hidden flex flex-col">
        {settings && (
          <div className="flex flex-col h-full">
            <WebViewHeader 
              property={propertyData}
              settings={settings}
            />
            <div className="flex-1 overflow-auto">
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
            {currentPage !== undefined && setCurrentPage && handlePrint && handleShare && (
              <WebViewFooter 
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                onNext={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
                onShare={handleShare}
                onPrint={handlePrint}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
