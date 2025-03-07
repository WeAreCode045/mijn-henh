
import { Button } from "@/components/ui/button";

interface WebViewNavigationProps {
  currentPage: number;
  totalPages: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function WebViewNavigation({
  currentPage,
  totalPages,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext
}: WebViewNavigationProps) {
  // Make sure we have valid page numbers
  const displayCurrentPage = Math.max(0, Math.min(currentPage, totalPages - 1)) + 1;
  const displayTotalPages = Math.max(1, totalPages);

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canGoBack) {
      onPrevious();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canGoForward) {
      onNext();
    }
  };

  return (
    <div className="flex justify-between mt-6">
      <Button 
        onClick={handlePrevious} 
        disabled={!canGoBack}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>
      <span className="text-sm">
        {totalPages > 0 ? `Page ${displayCurrentPage} of ${displayTotalPages}` : "Loading..."}
      </span>
      <Button 
        onClick={handleNext} 
        disabled={!canGoForward}
        variant="outline"
        size="sm"
      >
        Next
      </Button>
    </div>
  );
}
