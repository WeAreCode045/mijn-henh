
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  StatusSection, 
  AgentSection, 
  ActionButtons, 
  DateInfoSection, 
  ArchiveButton, 
  DeleteButton 
} from "./property-management";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface PropertyManagementCardProps {
  propertyId: string;
  agentId?: string;
  isArchived?: boolean;
  handleSaveAgent: (agentId: string) => Promise<void>;
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  onDelete: () => Promise<void>;
  createdAt?: string;
  updatedAt?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
}

export function PropertyManagementCard({
  propertyId,
  agentId,
  isArchived = false,
  handleSaveAgent,
  onGeneratePDF,
  onWebView,
  onDelete,
  createdAt,
  updatedAt,
  virtualTourUrl,
  youtubeUrl
}: PropertyManagementCardProps) {
  const { toast } = useToast();
  
  // Handle opening the web view in a new tab
  const handleWebView = useCallback((e: React.MouseEvent) => {
    console.log("PropertyManagementCard: handleWebView called");
    e.preventDefault();
    e.stopPropagation();
    
    // Get the web view URL
    const webViewUrl = `/property/${propertyId}/webview`;
    
    // Open in a new tab
    window.open(webViewUrl, '_blank', 'noopener,noreferrer');
    
    // Notify the user
    toast({
      title: "Web View",
      description: "Opening web view in a new tab",
    });
    
    // Also call the original handler if needed for analytics
    if (typeof onWebView === 'function') {
      onWebView(e);
    }
  }, [propertyId, onWebView, toast]);

  // Handle sharing the property link
  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Create the share URL
      const shareUrl = `${window.location.origin}/share/${propertyId}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Property share link copied to clipboard",
          });
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          toast({
            title: "Failed to Copy",
            description: "Could not copy link to clipboard",
            variant: "destructive"
          });
        });
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Error",
        description: "Failed to share link",
        variant: "destructive"
      });
    }
  }, [propertyId, toast]);

  // Handle opening the virtual tour in a new window
  const handleViewTour = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!virtualTourUrl) {
      toast({
        title: "No Virtual Tour",
        description: "This property doesn't have a virtual tour.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      window.open(virtualTourUrl, '_blank', 'noopener,noreferrer');
      toast({
        title: "Virtual Tour",
        description: "Opening virtual tour in a new tab",
      });
    } catch (error) {
      console.error('Error opening virtual tour:', error);
      toast({
        title: "Error",
        description: "Failed to open virtual tour",
        variant: "destructive"
      });
    }
  }, [virtualTourUrl, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Property Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusSection 
          propertyId={propertyId}
          isArchived={isArchived}
        />
        
        <AgentSection 
          agentId={agentId}
          handleSaveAgent={handleSaveAgent}
        />
        
        <Separator className="my-4" />
        
        <ActionButtons 
          onGeneratePDF={onGeneratePDF}
          onWebView={handleWebView}
          onShare={handleShare}
          onViewTour={handleViewTour}
          isArchived={isArchived}
          propertyId={propertyId}
          virtualTourUrl={virtualTourUrl}
          youtubeUrl={youtubeUrl}
        />
        
        <DateInfoSection 
          createdAt={createdAt}
          updatedAt={updatedAt}
        />
        
        <Separator className="my-4" />
        
        <ArchiveButton 
          propertyId={propertyId}
          isArchived={isArchived}
        />
        
        <DeleteButton onDelete={onDelete} />
      </CardContent>
    </Card>
  );
}
