
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Globe, 
  AlertTriangle,
  Trash2, 
  Copy,
  Twitter,
  Facebook,
  Mail,
  Share2,
  ExternalLink,
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { StatusSelector } from "./StatusSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false);
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleShareClick = () => {
    setShareLinkDialogOpen(true);
  };
  
  const copyToClipboard = () => {
    const url = `${window.location.origin}/property/${propertyId}`;
    navigator.clipboard.writeText(url);
    // Show toast notification (outside the scope of this component)
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Property Status</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusSelector 
            propertyId={propertyId} 
            initialStatus={""} 
          />
        </CardContent>
      </Card>

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Property Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Link Dialog */}
      <Dialog open={shareLinkDialogOpen} onOpenChange={setShareLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Property</DialogTitle>
            <DialogDescription>
              Share this property with clients or on social media
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={copyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Web View
            </Button>
            
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              {/* Add more social sharing buttons as needed */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
