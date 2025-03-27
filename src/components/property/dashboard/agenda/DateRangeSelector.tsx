
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
}

export function DateRangeSelector({ dateRange, setDateRange }: DateRangeSelectorProps) {
  // This component creates actual DateRange objects with from/to dates
  
  const handleRangeChange = (value: string) => {
    const today = new Date();
    
    switch(value) {
      case "today": {
        setDateRange({ from: today, to: today });
        break;
      }
      case "tomorrow": {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setDateRange({ from: tomorrow, to: tomorrow });
        break;
      }
      case "thisWeek": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(today);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
        setDateRange({ from: startOfWeek, to: endOfWeek });
        break;
      }
      case "thisMonth": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateRange({ from: startOfMonth, to: endOfMonth });
        break;
      }
      case "all":
      default:
        setDateRange(undefined);
        break;
    }
  };
  
  // Determine what's currently selected
  const getCurrentSelection = () => {
    if (!dateRange) return "all";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const from = dateRange.from;
    const to = dateRange.to || dateRange.from;
    
    if (from && to) {
      // Check if it's today
      if (from.getTime() === today.getTime() && to.getTime() === today.getTime()) {
        return "today";
      }
      
      // Check if it's tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (from.getTime() === tomorrow.getTime() && to.getTime() === tomorrow.getTime()) {
        return "tomorrow";
      }
      
      // Check if it's this week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(today);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      if (from.getTime() === startOfWeek.getTime() && to.getTime() === endOfWeek.getTime()) {
        return "thisWeek";
      }
      
      // Check if it's this month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      if (from.getTime() === startOfMonth.getTime() && to.getTime() === endOfMonth.getTime()) {
        return "thisMonth";
      }
    }
    
    return "custom";
  };
  
  return (
    <Select value={getCurrentSelection()} onValueChange={handleRangeChange}>
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
