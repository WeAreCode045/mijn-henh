
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function Navigation({ 
  currentPage, 
  totalPages,
  onPrevious,
  onNext 
}: NavigationProps) {
  return (
    <div className="mt-8 border-t pt-6 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm text-gray-500">
        Page {currentPage + 1} of {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
