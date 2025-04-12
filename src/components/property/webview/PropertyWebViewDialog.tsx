
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyData } from "@/types/property";
import { WebViewDialogContent } from "./WebViewDialogContent";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface PropertyWebViewDialogProps {
  propertyData: PropertyData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyWebViewDialog({
  propertyData,
  isOpen,
  onOpenChange,
}: PropertyWebViewDialogProps) {
  // Use object_id as the slug if available, otherwise use the property ID
  const slug = propertyData.object_id || propertyData.id;
  const shareUrl = `/share/${slug}`;
  const viewUrl = `/property/${slug}/webview`;
  
  useEffect(() => {
    console.log("PropertyWebViewDialog - dialog open state:", isOpen);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl h-[95vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex items-center justify-between flex-row p-6">
          <DialogTitle>Property Web View</DialogTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <span>Share link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <span>Full page</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <WebViewDialogContent propertyData={propertyData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
