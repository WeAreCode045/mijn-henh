
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, Printer, Share2 } from "lucide-react";

interface WebViewFooterProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onShare: (platform: string) => Promise<void>;
  onPrint: () => void;
}

export function WebViewFooter({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onShare,
  onPrint
}: WebViewFooterProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onShare('copy')}
          className="hover:bg-estate-100"
          title="Share link"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrint}
          className="hover:bg-estate-100"
          title="Print brochure"
        >
          <Printer className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentPage === 0}
          className="hover:bg-estate-100"
          title="Previous page"
        >
          <MoveLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm">
          {currentPage + 1} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentPage === totalPages - 1}
          className="hover:bg-estate-100"
          title="Next page"
        >
          <MoveRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
