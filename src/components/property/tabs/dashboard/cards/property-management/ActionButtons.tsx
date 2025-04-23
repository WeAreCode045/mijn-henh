
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { IconActionButtons } from "./IconActionButtons";
import { useState, useEffect } from "react";
import { PropertyWebViewDialog } from "@/components/property/webview/PropertyWebViewDialog";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  propertyData: initialPropertyData
}: ActionButtonsProps) {
  const { toast } = useToast();
  const [webViewOpen, setWebViewOpen] = useState(false);
  const [propertyData, setPropertyData] = useState<any>(initialPropertyData);
  
  console.log("ActionButtons - propertyId:", propertyId);
  console.log("ActionButtons - isArchived:", isArchived);
  console.log("ActionButtons - onGeneratePDF is function:", typeof onGeneratePDF === 'function');
  console.log("ActionButtons - onWebView is function:", typeof onWebView === 'function');

  // Fetch property data when needed
  useEffect(() => {
    // If we already have property data or the dialog isn't open, don't fetch
    if (propertyData || !webViewOpen) return;
    
    const fetchPropertyData = async () => {
      try {
        console.log("ActionButtons - Fetching property data for:", propertyId);
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(*)
          `)
          .eq('id', propertyId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          console.log("ActionButtons - Fetched property data successfully");
          setPropertyData(data);
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
        toast({
          title: "Error",
          description: "Failed to load property data",
          variant: "destructive",
        });
        // Close the dialog on error
        setWebViewOpen(false);
      }
    };
    
    fetchPropertyData();
  }, [propertyId, webViewOpen, propertyData, toast]);

  const handleWebViewClick = useCallback((e: React.MouseEvent) => {
    console.log("ActionButtons: handleWebViewClick called");
    e.preventDefault();
    e.stopPropagation();
    
    // Open the modal
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
      
      {/* WebView Modal Dialog - Only render when webViewOpen is true and we have property data */}
      {webViewOpen && propertyData && (
        <PropertyWebViewDialog
          propertyData={propertyData}
          isOpen={webViewOpen}
          onOpenChange={setWebViewOpen}
        />
      )}
    </div>
  );
}
