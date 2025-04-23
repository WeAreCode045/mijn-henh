
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Share, Printer } from "lucide-react";

interface WebViewFooterProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onShare: (platform: string) => Promise<void>;
  onPrint: () => void;
  isAdminView?: boolean;
}

export function WebViewFooter({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onShare,
  onPrint,
  isAdminView = false
}: WebViewFooterProps) {
  // Format page counter as "1 of 5"
  const pageCounter = `${currentPage + 1} of ${totalPages}`;
  
  return (
    <div className="bg-white border-t border-gray-200 px-8 py-4">
      <div className="flex justify-between items-center">
        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          
          <span className="text-sm text-gray-500 px-2">{pageCounter}</span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentPage >= totalPages - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {isAdminView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('copy')}
            >
              <Share className="h-4 w-4 mr-1" /> Share
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
          >
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
        </div>
      </div>
    </div>
  );
}
