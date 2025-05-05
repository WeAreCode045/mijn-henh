
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IconActionButtons } from "./IconActionButtons";
import { useCallback } from "react";

interface ActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onViewTour?: (e: React.MouseEvent) => void;
  isArchived?: boolean;
  propertyId: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  showTextButtons?: boolean;
  // Remove properties that aren't needed
  // agentId?: string;
  // handleSaveAgent?: (agentId: string) => Promise<void>;
  // createdAt?: string;
  // updatedAt?: string;
  // propertyData?: any;
}

export function ActionButtons({ 
  onGeneratePDF, 
  onWebView, 
  onShare = () => {},
  onViewTour = () => {},
  isArchived = false,
  propertyId,
  virtualTourUrl,
  youtubeUrl,
  showTextButtons = true,
  // Remove unused properties
  // agentId,
  // handleSaveAgent,
  // createdAt,
  // updatedAt,
  // propertyData: initialPropertyData
}: ActionButtonsProps) {
  const { toast } = useToast();
  
  // Get the web view URL
  const getWebViewUrl = useCallback(() => {
    return `/property/${propertyId}/webview`;
  }, [propertyId]);
  
  // Handle web view click - open in new tab
  const handleWebViewClick = useCallback((e: React.MouseEvent) => {
    console.log("ActionButtons: handleWebViewClick called");
    e.preventDefault();
    e.stopPropagation();
    
    // Open in a new tab
    const webViewUrl = getWebViewUrl();
    window.open(webViewUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Web View",
      description: "Opening web view in a new tab",
    });
    
    // Also call the original handler if it exists (for analytics, etc.)
    if (typeof onWebView === 'function') {
      onWebView(e);
    }
  }, [onWebView, getWebViewUrl, toast]);

  return (
    <div className="space-y-4">
      {/* Icon-only buttons */}
      <IconActionButtons
        onGeneratePDF={onGeneratePDF}
        onWebView={handleWebViewClick} // Use our new handler that opens in a new tab
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
            onClick={(e) => {
              console.log(`ActionButtons: Generate PDF button clicked for property ${propertyId}`);
              e.preventDefault();
              e.stopPropagation();
              onGeneratePDF(e);
            }}
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
