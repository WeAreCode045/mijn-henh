
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  propertyId: string;
}

export function ShareButton({ propertyId }: ShareButtonProps) {
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/share/${propertyId}`;

  const handleShare = async (platform: string) => {
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "The share link has been copied to your clipboard",
        });
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out this property&body=${encodeURIComponent(shareUrl)}`;
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
