
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
  return (
    <div className="flex justify-between mt-6">
      <Button 
        onClick={onPrevious} 
        disabled={!canGoBack}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage + 1} of {totalPages}
      </span>
      <Button 
        onClick={onNext} 
        disabled={!canGoForward}
        variant="outline"
        size="sm"
      >
        Next
      </Button>
    </div>
  );
}
