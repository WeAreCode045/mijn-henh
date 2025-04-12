
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { useCallback } from "react";
import { IconActionButtons } from "./IconActionButtons";

interface ActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onViewTour?: (e: React.MouseEvent) => void;
  isArchived?: boolean;
  propertyId: string;
  virtualTourUrl?: string;
  showTextButtons?: boolean;
}

export function ActionButtons({ 
  onGeneratePDF, 
  onWebView, 
  onShare = () => {},
  onViewTour = () => {},
  isArchived = false,
  propertyId,
  virtualTourUrl = "",
  showTextButtons = true
}: ActionButtonsProps) {
  // Create standalone handlers with improved logging
  const handlePDFClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`ActionButtons: Generate PDF button clicked for property ${propertyId}`);
    onGeneratePDF(e);
  }, [onGeneratePDF, propertyId]);
  
  const handleWebViewClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`ActionButtons: Web View button clicked for property ${propertyId}`);
    onWebView(e);
  }, [onWebView, propertyId]);

  return (
    <div className="space-y-4">
      {/* Icon-only buttons */}
      <IconActionButtons
        onGeneratePDF={onGeneratePDF}
        onWebView={onWebView}
        onShare={onShare}
        onViewTour={onViewTour}
        isArchived={isArchived}
        propertyId={propertyId}
        virtualTourUrl={virtualTourUrl}
      />
      
      {/* Original text buttons if showTextButtons is true */}
      {showTextButtons && (
        <div className="space-y-2">
          <Button 
            onClick={handlePDFClick}
            variant="outline" 
            className="w-full justify-start" 
            disabled={isArchived}
            type="button"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
          
          <Button 
            onClick={handleWebViewClick}
            variant="outline" 
            className="w-full justify-start" 
            disabled={isArchived}
            type="button"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Web View
          </Button>
        </div>
      )}
    </div>
  );
}
