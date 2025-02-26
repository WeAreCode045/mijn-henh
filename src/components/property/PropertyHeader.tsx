
import { Button } from "@/components/ui/button";
import { Share2, Printer, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyHeaderProps {
  logoUrl?: string;
  pdfUrl?: string;
  onShare: (platform: string) => void;
  onPrint: () => void;
}

export function PropertyHeader({ logoUrl, pdfUrl, onShare, onPrint }: PropertyHeaderProps) {
  return (
    <div className="p-6 border-b flex items-center justify-between">
      {logoUrl && (
        <img src={logoUrl} alt="Agency Logo" className="h-12 object-contain" />
      )}
      <div className="text-2xl font-semibold">Brochure</div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onShare('whatsapp')}>
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare('facebook')}>
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare('linkedin')}>
              LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare('email')}>
              Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" onClick={onPrint}>
          <Printer className="h-4 w-4" />
        </Button>
        {pdfUrl && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
