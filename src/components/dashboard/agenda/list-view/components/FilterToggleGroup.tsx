
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FilterToggleGroupProps {
  filterValue: string;
  onFilterChange: (value: string) => void;
}

export function FilterToggleGroup({ filterValue, onFilterChange }: FilterToggleGroupProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-b py-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-sm font-medium whitespace-nowrap">View:</span>
        <ToggleGroup type="single" value={filterValue} onValueChange={onFilterChange}>
          <ToggleGroupItem value="past" size="sm">Past</ToggleGroupItem>
          <ToggleGroupItem value="today" size="sm">Today</ToggleGroupItem>
          <ToggleGroupItem value="upcoming" size="sm">Upcoming</ToggleGroupItem>
          <ToggleGroupItem value="thisWeek" size="sm">This Week</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
