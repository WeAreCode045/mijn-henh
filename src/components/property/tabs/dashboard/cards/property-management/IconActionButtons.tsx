
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Share, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface IconActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onViewTour?: (e: React.MouseEvent) => void;
  isArchived?: boolean;
  propertyId: string;
  virtualTourUrl?: string;
}

export function IconActionButtons({
  onGeneratePDF,
  onWebView,
  onShare,
  onViewTour,
  isArchived = false,
  propertyId,
  virtualTourUrl
}: IconActionButtonsProps) {
  const { toast } = useToast();
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/share/${propertyId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Share link copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      });
    
    if (onShare) {
      onShare(e);
    }
  };

  return (
    <div className="flex items-center justify-start flex-wrap gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onGeneratePDF}
        disabled={isArchived}
        title="Generate PDF"
        type="button"
      >
        <FileText className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onWebView}
        disabled={isArchived}
        title="Open Web View"
        type="button"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline" 
        size="icon"
        onClick={handleShareClick}
        disabled={isArchived}
        title="Copy Share Link"
        type="button"
      >
        <Share className="h-4 w-4" />
      </Button>
      
      {virtualTourUrl && (
        <Button
          variant="outline"
          size="icon"
          onClick={onViewTour}
          disabled={isArchived}
          title="View Virtual Tour"
          type="button"
        >
          <Video className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
