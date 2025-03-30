
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
  viewMode?: 'day' | 'week';
}

export function CalendarHeader({
  currentDate,
  goToPrevious,
  goToNext,
  goToToday,
  viewMode = 'week'
}: CalendarHeaderProps) {
  // Format header title based on view mode
  const getHeaderTitle = () => {
    if (viewMode === 'day') {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    } else {
      // For week view, show the week range
      const weekStart = startOfWeek(currentDate);
      const weekEnd = addDays(weekStart, 6);
      return `${format(weekStart, "MMMM d")} - ${format(weekEnd, "MMMM d, yyyy")}`;
    }
  };

  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-2">
        <Button onClick={goToPrevious} variant="outline" size="icon" className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button onClick={goToToday} variant="outline" className="h-8">
          Today
        </Button>
        
        <Button onClick={goToNext} variant="outline" size="icon" className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
    </div>
  );
}
