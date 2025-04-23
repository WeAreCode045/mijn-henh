
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
import { useToast } from "@/components/ui/use-toast";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
}

export function ShareLinkDialog({ open, onOpenChange, propertyId }: ShareLinkDialogProps) {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    const url = `${window.location.origin}/share/${propertyId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Property link copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy link to clipboard",
          variant: "destructive"
        });
      });
  };
  
  const openWebView = () => {
    const url = `${window.location.origin}/share/${propertyId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaEmail = () => {
    const url = `${window.location.origin}/share/${propertyId}`;
    const subject = "Check out this property";
    const body = `I thought you might be interested in this property:\n\n${url}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const shareOnFacebook = () => {
    const url = `${window.location.origin}/share/${propertyId}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };
  
  const shareOnTwitter = () => {
    const url = `${window.location.origin}/share/${propertyId}`;
    const text = "Check out this property";
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
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
            onClick={shareViaEmail}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={openWebView}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Web View
          </Button>
          
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={shareOnFacebook}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={shareOnTwitter}
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
