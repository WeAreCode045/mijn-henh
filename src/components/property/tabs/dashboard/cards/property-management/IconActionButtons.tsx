
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Share2, Video } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IconActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onViewTour: (e: React.MouseEvent) => void;
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
  virtualTourUrl,
}: IconActionButtonsProps) {
  const handlePDFClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`IconActionButtons: Generate PDF button clicked for property ${propertyId}`);
    onGeneratePDF(e);
  };
  
  const handleWebViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`IconActionButtons: Web View button clicked for property ${propertyId}`);
    onWebView(e);
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`IconActionButtons: Share button clicked for property ${propertyId}`);
    onShare(e);
  };
  
  const handleTourClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`IconActionButtons: Virtual Tour button clicked for property ${propertyId}`);
    onViewTour(e);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handlePDFClick}
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={isArchived}
              type="button"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleWebViewClick}
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={isArchived}
              type="button"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Web View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleShareClick}
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={isArchived}
              type="button"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share Link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleTourClick}
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={isArchived || !virtualTourUrl}
              type="button"
            >
              <Video className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{virtualTourUrl ? "View 360° Tour" : "No 360° Tour Available"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
