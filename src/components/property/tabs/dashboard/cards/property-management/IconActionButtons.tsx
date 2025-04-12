
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
  const handleButtonClick = (
    e: React.MouseEvent,
    handlerFunction: (e: React.MouseEvent) => void,
    buttonName: string
  ) => {
    console.log(`IconActionButtons: ${buttonName} button clicked for property ${propertyId}`);
    e.preventDefault();
    e.stopPropagation();
    handlerFunction(e);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => handleButtonClick(e, onGeneratePDF, "Generate PDF")}
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
              onClick={(e) => handleButtonClick(e, onWebView, "Web View")}
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
              onClick={(e) => handleButtonClick(e, onShare, "Share")}
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
              onClick={(e) => handleButtonClick(e, onViewTour, "Virtual Tour")}
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
