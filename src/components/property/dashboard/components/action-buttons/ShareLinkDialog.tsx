
import { Button } from "@/components/ui/button";
import { 
  Copy,
  Twitter,
  Facebook,
  Mail,
  ExternalLink,
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
}

export function ShareLinkDialog({ open, onOpenChange, propertyId }: ShareLinkDialogProps) {
  const copyToClipboard = () => {
    const url = `${window.location.origin}/property/${propertyId}`;
    navigator.clipboard.writeText(url);
    // Show toast notification (outside the scope of this component)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
}
