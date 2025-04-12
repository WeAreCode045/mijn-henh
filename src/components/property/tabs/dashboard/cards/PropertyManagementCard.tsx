
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
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyWebViewDialog } from "@/components/property/webview/PropertyWebViewDialog";

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
  const [propertyData, setPropertyData] = useState<any>(null);
  const [webViewOpen, setWebViewOpen] = useState(false);
  
  console.log("PropertyManagementCard - propertyId:", propertyId);
  console.log("PropertyManagementCard - isArchived:", isArchived);
  console.log("PropertyManagementCard - onGeneratePDF is function:", typeof onGeneratePDF === 'function');
  console.log("PropertyManagementCard - onWebView is function:", typeof onWebView === 'function');

  // Fetch property data for the modal
  useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
        
      if (error) throw error;
      if (data) setPropertyData(data);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  }, [propertyId]);

  // Handle sharing the property link
  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Create the share URL (web view URL)
      const shareUrl = `${window.location.origin}/property/${propertyId}/webview`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: 'Property Web View',
          url: shareUrl
        })
        .then(() => {
          console.log('Successfully shared');
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          // Fallback to clipboard
          copyToClipboard(shareUrl);
        });
      } else {
        // Fallback for browsers without Web Share API
        copyToClipboard(shareUrl);
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Error",
        description: "Failed to share link",
        variant: "destructive"
      });
    }
  }, [propertyId, toast]);

  // Copy URL to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Property link copied to clipboard",
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
  };

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

  // Handle web view
  const handleWebView = useCallback((e: React.MouseEvent) => {
    console.log("PropertyManagementCard: handleWebView called");
    e.preventDefault();
    e.stopPropagation();
    
    // Open the modal
    setWebViewOpen(true);
    
    // Also call the original handler if needed
    // if (typeof onWebView === 'function') {
    //   onWebView(e);
    // }
  }, []);

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
          agentId={agentId}
          handleSaveAgent={handleSaveAgent}
          createdAt={createdAt}
          updatedAt={updatedAt}
          virtualTourUrl={virtualTourUrl}
          youtubeUrl={youtubeUrl}
          showTextButtons={true}
          propertyData={propertyData}
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
      
      {/* WebView Modal Dialog directly in the card for initial property load */}
      {propertyData && (
        <PropertyWebViewDialog
          propertyData={propertyData}
          isOpen={webViewOpen}
          onOpenChange={setWebViewOpen}
        />
      )}
    </Card>
  );
}
