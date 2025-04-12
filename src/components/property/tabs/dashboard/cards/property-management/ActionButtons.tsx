
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { IconActionButtons } from "./IconActionButtons";
import { useState } from "react";
import { PropertyWebViewDialog } from "@/components/property/webview/PropertyWebViewDialog";
import { useCallback } from "react";

interface ActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onViewTour?: (e: React.MouseEvent) => void;
  isArchived?: boolean;
  propertyId: string;
  agentId?: string;
  handleSaveAgent: (agentId: string) => Promise<void>;
  createdAt?: string;
  updatedAt?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  showTextButtons?: boolean;
  propertyData?: any;
}

export function ActionButtons({ 
  onGeneratePDF, 
  onWebView, 
  onShare = () => {},
  onViewTour = () => {},
  isArchived = false,
  propertyId,
  agentId,
  handleSaveAgent,
  createdAt,
  updatedAt,
  virtualTourUrl,
  youtubeUrl,
  showTextButtons = true,
  propertyData
}: ActionButtonsProps) {
  const { toast } = useToast();
  const [webViewOpen, setWebViewOpen] = useState(false);
  
  console.log("ActionButtons - propertyId:", propertyId);
  console.log("ActionButtons - isArchived:", isArchived);
  console.log("ActionButtons - onGeneratePDF is function:", typeof onGeneratePDF === 'function');
  console.log("ActionButtons - onWebView is function:", typeof onWebView === 'function');

  const handleWebViewClick = useCallback((e: React.MouseEvent) => {
    console.log("ActionButtons: handleWebViewClick called");
    e.preventDefault();
    e.stopPropagation();
    
    // Open the modal instead of navigating to a new page
    setWebViewOpen(true);
    
    // Also call the original handler if it exists (for analytics, etc.)
    if (typeof onWebView === 'function') {
      // We don't want the default behavior, which is opening in a new tab
      // onWebView(e);
    }
  }, [onWebView]);

  return (
    <div className="space-y-4">
      {/* Icon-only buttons */}
      <IconActionButtons
        onGeneratePDF={onGeneratePDF}
        onWebView={handleWebViewClick} // Use our new handler that opens the modal
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
            onClick={(e) => {
              console.log(`ActionButtons: Web View button clicked for property ${propertyId}`);
              e.preventDefault();
              e.stopPropagation();
              handleWebViewClick(e);
            }}
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
      
      {/* WebView Modal Dialog */}
      {propertyData && (
        <PropertyWebViewDialog
          propertyData={propertyData}
          isOpen={webViewOpen}
          onOpenChange={setWebViewOpen}
        />
      )}
    </div>
  );
}
