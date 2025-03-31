
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
        <ToggleGroup type="single" value={filterValue} onValueChange={setFilterValue}>
          <ToggleGroupItem value="past" size="sm">Past</ToggleGroupItem>
          <ToggleGroupItem value="day" size="sm">Today</ToggleGroupItem>
          <ToggleGroupItem value="week" size="sm">This Week</ToggleGroupItem>
          <ToggleGroupItem value="month" size="sm">This Month</ToggleGroupItem>
          <ToggleGroupItem value="all" size="sm">Upcoming</ToggleGroupItem>
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
