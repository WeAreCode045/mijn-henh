
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { StatusSection } from "./StatusSection";
import { AgentSection } from "./AgentSection";
import { DateInfoSection } from "./DateInfoSection";
import { ArchiveButton } from "./ArchiveButton";
import { DeleteButton } from "./DeleteButton";
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { IconActionButtons } from "./IconActionButtons";

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
  showTextButtons = true
}: ActionButtonsProps) {
  const { toast } = useToast();
  
  console.log("ActionButtons - propertyId:", propertyId);
  console.log("ActionButtons - isArchived:", isArchived);
  console.log("ActionButtons - onGeneratePDF is function:", typeof onGeneratePDF === 'function');
  console.log("ActionButtons - onWebView is function:", typeof onWebView === 'function');

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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(`ActionButtons: Generate PDF button clicked for property ${propertyId}`);
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
              e.preventDefault();
              e.stopPropagation();
              console.log(`ActionButtons: Web View button clicked for property ${propertyId}`);
              onWebView(e);
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
    </div>
  );
}
