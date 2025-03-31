
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FilterControlsProps {
  filterValue: string | undefined;
  setFilterValue: (value: string | undefined) => void;
}

export function FilterControls({
  filterValue,
  setFilterValue
}: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2">
      <div className="flex items-center gap-2">
        <ToggleGroup type="single" value={filterValue} onValueChange={setFilterValue}>
          <ToggleGroupItem value="today" size="sm">Today</ToggleGroupItem>
          <ToggleGroupItem value="week" size="sm">This Week</ToggleGroupItem>
          <ToggleGroupItem value="month" size="sm">This Month</ToggleGroupItem>
          <ToggleGroupItem value="all" size="sm">All</ToggleGroupItem>
          <ToggleGroupItem value="lastWeek" size="sm">Last Week</ToggleGroupItem>
          <ToggleGroupItem value="lastMonth" size="sm">Last Month</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
