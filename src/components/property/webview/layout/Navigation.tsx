
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
    <div className="flex justify-between items-center py-2">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage === 0}
        className="shadow-sm"
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
        className="shadow-sm"
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
