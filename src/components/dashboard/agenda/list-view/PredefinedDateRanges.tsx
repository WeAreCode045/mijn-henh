
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { 
  addDays, 
  addMonths, 
  addWeeks, 
  endOfMonth, 
  endOfWeek, 
  startOfMonth, 
  startOfWeek, 
  subDays, 
  subMonths, 
  subWeeks 
} from "date-fns";

interface PredefinedDateRangesProps {
  setDateRange: (range: DateRange | undefined) => void;
}

export function PredefinedDateRanges({ setDateRange }: PredefinedDateRangesProps) {
  const today = new Date();
  
  const predefinedRanges = [
    { label: "Today", 
      onClick: () => setDateRange({ from: today, to: today }) },
    { label: "Yesterday", 
      onClick: () => {
        const yesterday = subDays(today, 1);
        setDateRange({ from: yesterday, to: yesterday });
      } 
    },
    { label: "Tomorrow", 
      onClick: () => {
        const tomorrow = addDays(today, 1);
        setDateRange({ from: tomorrow, to: tomorrow });
      } 
    },
    { label: "This Week", 
      onClick: () => setDateRange({ 
        from: startOfWeek(today, { weekStartsOn: 1 }), 
        to: endOfWeek(today, { weekStartsOn: 1 }) 
      }) 
    },
    { label: "Last Week", 
      onClick: () => {
        const lastWeek = subWeeks(today, 1);
        setDateRange({ 
          from: startOfWeek(lastWeek, { weekStartsOn: 1 }), 
          to: endOfWeek(lastWeek, { weekStartsOn: 1 }) 
        });
      } 
    },
    { label: "Next Week", 
      onClick: () => {
        const nextWeek = addWeeks(today, 1);
        setDateRange({ 
          from: startOfWeek(nextWeek, { weekStartsOn: 1 }), 
          to: endOfWeek(nextWeek, { weekStartsOn: 1 }) 
        });
      } 
    },
    { label: "This Month", 
      onClick: () => setDateRange({ 
        from: startOfMonth(today), 
        to: endOfMonth(today) 
      }) 
    },
    { label: "Last Month", 
      onClick: () => {
        const lastMonth = subMonths(today, 1);
        setDateRange({ 
          from: startOfMonth(lastMonth), 
          to: endOfMonth(lastMonth) 
        });
      } 
    },
    { label: "Next Month", 
      onClick: () => {
        const nextMonth = addMonths(today, 1);
        setDateRange({ 
          from: startOfMonth(nextMonth), 
          to: endOfMonth(nextMonth) 
        });
      } 
    },
    { label: "Last 30 Days", 
      onClick: () => setDateRange({ 
        from: subDays(today, 30), 
        to: today 
      }) 
    },
    { label: "Next 30 Days", 
      onClick: () => setDateRange({ 
        from: today, 
        to: addDays(today, 30) 
      }) 
    }
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {predefinedRanges.map((range) => (
        <Button
          key={range.label}
          variant="outline"
          size="sm"
          className="whitespace-nowrap"
          onClick={range.onClick}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
