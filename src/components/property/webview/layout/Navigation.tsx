
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
        variant="ghost"
        onClick={onPrevious}
        disabled={currentPage === 0}
        className="hover:bg-black/5 transition-colors disabled:opacity-30 text-gray-700"
      >
        <ChevronLeft className="mr-2 h-5 w-5" />
        Previous
      </Button>

      <div className="px-4 py-1 rounded-full bg-black/5 backdrop-blur-sm">
        <span className="text-sm font-medium text-gray-700">
          {currentPage + 1} / {totalPages}
        </span>
      </div>

      <Button
        variant="ghost"
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className="hover:bg-black/5 transition-colors disabled:opacity-30 text-gray-700"
      >
        Next
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
