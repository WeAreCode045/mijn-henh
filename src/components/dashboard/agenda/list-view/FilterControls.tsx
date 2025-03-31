
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FilterControlsProps {
  filterValue: string | undefined;
  setFilterValue: (value: string | undefined) => void;
}

export function FilterControls({
  filterValue,
  setFilterValue
}: FilterControlsProps) {
  const handleFilterChange = (value: string) => {
    console.log("Filter changed to:", value);
    
    // If clicking the same button, toggle it off
    if (value === filterValue) {
      setFilterValue(undefined);
    } else {
      setFilterValue(value);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 border-t border-b py-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-sm font-medium whitespace-nowrap">Additional Filter:</span>
        <ToggleGroup type="single" value={filterValue || ""} onValueChange={handleFilterChange}>
          <ToggleGroupItem value="today" size="sm">Today</ToggleGroupItem>
          <ToggleGroupItem value="week" size="sm">This Week</ToggleGroupItem>
          <ToggleGroupItem value="month" size="sm">This Month</ToggleGroupItem>
          <ToggleGroupItem value="upcoming" size="sm">Upcoming</ToggleGroupItem>
          <ToggleGroupItem value="past" size="sm">Past</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
