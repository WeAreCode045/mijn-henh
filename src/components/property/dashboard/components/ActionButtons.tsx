
import { Button } from "@/components/ui/button";
import { FileDown, Share2, Globe, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from "@/types/property";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";

interface ActionButtonsProps {
  propertyId: string;
  propertyData?: PropertyData;
  onDelete?: () => Promise<void>;
  onWebView?: (e: React.MouseEvent) => void;
  isGenerating?: boolean;
  onGeneratePDF: () => void;
}

export function ActionButtons({ 
  propertyId, 
  propertyData,
  onDelete, 
  onWebView,
  isGenerating = false,
  onGeneratePDF
}: ActionButtonsProps) {
  const { toast } = useToast();

  const handleShare = () => {
    // Use objectId as slug if available, otherwise use id
    const slug = propertyData?.object_id || propertyId;
    const url = `${window.location.origin}/share/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others",
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={onDelete}
        variant="destructive"
        className="w-full flex items-center gap-2"
        size="sm"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
      <Button
        onClick={onWebView}
        variant="outline"
        className="w-full flex items-center gap-2"
        size="sm"
        type="button" 
      >
        <Globe className="h-4 w-4" />
        Web View
      </Button>
      <Button
        onClick={onGeneratePDF}
        variant="outline"
        className="w-full flex items-center gap-2"
        size="sm"
        disabled={isGenerating}
      >
        <FileDown className="h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate PDF"}
      </Button>
      <Button
        onClick={handleShare}
        variant="outline"
        className="w-full flex items-center gap-2"
        size="sm"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
}
