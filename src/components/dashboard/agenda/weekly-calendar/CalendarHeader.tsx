
import React from "react";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentWeek: Date[];
  goToPreviousWeek: () => void;
  goToToday: () => void;
  goToNextWeek: () => void;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export function CalendarHeader({
  currentWeek,
  goToPreviousWeek,
  goToToday,
  goToNextWeek,
  activeTab,
  onTabChange
}: CalendarHeaderProps) {
  // Ensure we have a valid date for formatting
  const firstDayOfWeek = currentWeek?.[0];
  const formattedDate = firstDayOfWeek && isValid(firstDayOfWeek) 
    ? format(firstDayOfWeek, "MMMM yyyy") + " (Week " + format(firstDayOfWeek, "w") + ")"
    : "Invalid date";

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPreviousWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="h-8"
        >
          Today
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToNextWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h3 className="text-lg font-medium">
        {formattedDate}
      </h3>
      
      <div className="flex space-x-1">
        <Button 
          variant={activeTab === "day" ? "secondary" : "outline"} 
          size="sm" 
          className="h-8"
          onClick={() => onTabChange && onTabChange("day")}
        >
          Day
        </Button>
        <Button 
          variant={activeTab === "week" ? "secondary" : "outline"} 
          size="sm" 
          className="h-8"
          onClick={() => onTabChange && onTabChange("week")}
        >
          Week
        </Button>
      </div>
    </div>
  );
}
