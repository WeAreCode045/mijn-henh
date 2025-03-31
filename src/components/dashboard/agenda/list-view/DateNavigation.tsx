
import { DateRange } from "react-day-picker";
import { useDateNavigation } from "./hooks/useDateNavigation";
import { FilterToggleGroup } from "./components/FilterToggleGroup";
import { PastEventsPresets } from "./components/PastEventsPresets";
import { UpcomingEventsPresets } from "./components/UpcomingEventsPresets";

interface DateNavigationProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export function DateNavigation({
  selectedDate,
  setSelectedDate,
  dateRange,
  setDateRange,
  filterValue,
  setFilterValue
}: DateNavigationProps) {
  const {
    showPastPresets,
    showUpcomingPresets,
    handleFilterChange,
    handlePresetClick
  } = useDateNavigation(filterValue);
  
  return (
    <div className="space-y-4">
      {/* Main filter toggle group */}
      <FilterToggleGroup 
        filterValue={filterValue} 
        onFilterChange={(value) => {
          // Call the local handler first to update UI state
          handleFilterChange(value);
          
          // Then update parent state
          setFilterValue(value);
          
          // Update date range in parent component
          if (value === "past") {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const farPast = new Date(1970, 0, 1);
            setDateRange({ from: farPast, to: yesterday });
          } else if (value === "upcoming") {
            const today = new Date();
            const farFuture = new Date();
            farFuture.setFullYear(farFuture.getFullYear() + 100);
            setDateRange({ from: today, to: farFuture });
          }
        }} 
      />
      
      {/* Past event presets */}
      <PastEventsPresets 
        visible={showPastPresets}
        onPresetClick={(preset) => {
          // Call the local handler first
          handlePresetClick(preset);
          
          // Then update parent state
          setFilterValue(preset);
          
          // Update parent's date range directly based on preset
          const today = new Date();
          if (preset === "yesterday") {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            setDateRange({ from: yesterday, to: yesterday });
          } else if (preset === "lastWeek") {
            const lastMonday = new Date(today);
            lastMonday.setDate(today.getDate() - today.getDay() - 6);
            const lastSunday = new Date(today);
            lastSunday.setDate(today.getDate() - today.getDay());
            setDateRange({ from: lastMonday, to: lastSunday });
          } else if (preset === "thisMonth") {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            setDateRange({ from: firstDay, to: yesterday });
          } else if (preset === "lastMonth") {
            const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
            setDateRange({ from: firstDay, to: lastDay });
          } else if (preset === "last30Days") {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            setDateRange({ from: thirtyDaysAgo, to: yesterday });
          } else if (preset === "past") {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const farPast = new Date(1970, 0, 1);
            setDateRange({ from: farPast, to: yesterday });
          }
        }}
      />
      
      {/* Upcoming event presets */}
      <UpcomingEventsPresets 
        visible={showUpcomingPresets}
        onPresetClick={(preset) => {
          // Call the local handler first
          handlePresetClick(preset);
          
          // Then update parent state
          setFilterValue(preset);
          
          // Update parent's date range directly based on preset
          const today = new Date();
          if (preset === "tomorrow") {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            setDateRange({ from: tomorrow, to: tomorrow });
          } else if (preset === "thisWeek") {
            // This function is defined in useDateNavigation, we need to replicate it here
            const getWeekStart = (date: Date): Date => {
              const monday = new Date(date);
              monday.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
              return monday;
            };
            
            const getWeekEnd = (date: Date): Date => {
              const sunday = new Date(date);
              const monday = getWeekStart(date);
              sunday.setDate(monday.getDate() + 6);
              return sunday;
            };
            
            setDateRange({ from: getWeekStart(today), to: getWeekEnd(today) });
          } else if (preset === "nextWeek") {
            const nextMonday = new Date(today);
            nextMonday.setDate(today.getDate() - today.getDay() + 8);
            const nextSunday = new Date(nextMonday);
            nextSunday.setDate(nextMonday.getDate() + 6);
            setDateRange({ from: nextMonday, to: nextSunday });
          } else if (preset === "thisMonth") {
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            setDateRange({ from: today, to: lastDay });
          } else if (preset === "next30Days") {
            const thirtyDaysLater = new Date(today);
            thirtyDaysLater.setDate(today.getDate() + 30);
            setDateRange({ from: today, to: thirtyDaysLater });
          } else if (preset === "upcoming") {
            const farFuture = new Date(today);
            farFuture.setFullYear(farFuture.getFullYear() + 100);
            setDateRange({ from: today, to: farFuture });
          }
        }}
      />
    </div>
  );
}
