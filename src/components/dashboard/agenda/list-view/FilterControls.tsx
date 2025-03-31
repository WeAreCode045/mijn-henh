
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { History } from "lucide-react";

interface FilterControlsProps {
  showPastEvents: boolean;
  setShowPastEvents: (show: boolean) => void;
  filterValue: string | undefined;
  setFilterValue: (value: string | undefined) => void;
}

export function FilterControls({
  showPastEvents,
  setShowPastEvents,
  filterValue,
  setFilterValue
}: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setShowPastEvents(!showPastEvents)}
        >
          <History className="h-4 w-4" />
          {showPastEvents ? "Hide past events" : "Show past events"}
        </Button>
        
        <ToggleGroup type="single" value={filterValue} onValueChange={setFilterValue}>
          <ToggleGroupItem value="day" size="sm">Day</ToggleGroupItem>
          <ToggleGroupItem value="week" size="sm">Week</ToggleGroupItem>
          <ToggleGroupItem value="month" size="sm">Month</ToggleGroupItem>
          <ToggleGroupItem value="all" size="sm">All</ToggleGroupItem>
        </ToggleGroup>
        
        {filterValue && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilterValue(undefined)}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
