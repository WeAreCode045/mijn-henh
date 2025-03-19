
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Save, Trash2, Share2, Globe, FileText } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from "@/types/property";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";
import { useAgencySettings } from "@/hooks/useAgencySettings";

interface ActionsCardProps {
  propertyId: string;
  propertyData?: PropertyData;
  createdAt?: string;
  updatedAt?: string;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  onWebView?: () => void;
}

export function ActionsCard({ 
  propertyId, 
  propertyData,
  createdAt, 
  updatedAt, 
  onSave, 
  onDelete, 
  onWebView
}: ActionsCardProps) {
  const { toast } = useToast();
  const { generatePDF, isGenerating } = useGeneratePDF();
  const { settings } = useAgencySettings();

  const handleShare = () => {
    const url = `${window.location.origin}/property/view/${propertyId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others",
    });
  };

  const handleGeneratePDF = async () => {
    if (!propertyData) {
      toast({
        title: "Error",
        description: "Property data is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await generatePDF(propertyData);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-sm">{createdAt ? formatDate(createdAt) : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-sm">{updatedAt ? formatDate(updatedAt) : "N/A"}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={onSave}
            className="w-full flex items-center gap-2"
            size="sm"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
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
          >
            <Globe className="h-4 w-4" />
            Web View
          </Button>
          <Button
            onClick={handleGeneratePDF}
            variant="outline"
            className="w-full flex items-center gap-2"
            size="sm"
            disabled={isGenerating}
          >
            <FileText className="h-4 w-4" />
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
      </CardContent>
    </Card>
  );
}
