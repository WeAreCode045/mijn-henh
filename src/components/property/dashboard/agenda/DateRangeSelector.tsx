
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "./types";

interface DateRangeSelectorProps {
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
}

export function DateRangeSelector({ dateRange, setDateRange }: DateRangeSelectorProps) {
  return (
    <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
      <SelectTrigger className="w-[120px] h-8 text-xs">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="tomorrow">Tomorrow</SelectItem>
        <SelectItem value="thisWeek">This Week</SelectItem>
        <SelectItem value="thisMonth">This Month</SelectItem>
        <SelectItem value="all">All Items</SelectItem>
      </SelectContent>
    </Select>
  );
}
