
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Globe, 
  Share2,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteDialog } from "./DeleteDialog";
import { ShareLinkDialog } from "./ShareLinkDialog";
import { StatusCard } from "./StatusCard";

interface ActionButtonsProps {
  propertyId: string;
  onDelete: () => Promise<void>;
  onWebView: (e: React.MouseEvent) => void;
  onGeneratePDF: () => void;
  isCompact?: boolean;
}

export function ActionButtons({ 
  propertyId, 
  onDelete, 
  onWebView, 
  onGeneratePDF,
  isCompact = false
}: ActionButtonsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false);
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleShareClick = () => {
    setShareLinkDialogOpen(true);
  };

  return (
    <>
      <StatusCard propertyId={propertyId} />

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {isCompact ? (
            // Grid layout for mobile view
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={onGeneratePDF}
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={onWebView}
              >
                <Globe className="mr-2 h-4 w-4" />
                Web
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={handleShareClick}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start text-destructive hover:text-destructive" 
                onClick={handleDeleteClick}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          ) : (
            // Full buttons for desktop view
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onGeneratePDF}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate PDF
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onWebView}
              >
                <Globe className="mr-2 h-4 w-4" />
                Web View
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleShareClick}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Property
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                onClick={handleDeleteClick}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Property
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DeleteDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onDelete={onDelete} 
      />
      
      <ShareLinkDialog 
        open={shareLinkDialogOpen} 
        onOpenChange={setShareLinkDialogOpen}
        propertyId={propertyId}
      />
    </>
  );
}
