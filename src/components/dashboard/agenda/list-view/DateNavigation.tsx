
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
          handleFilterChange(value);
          setFilterValue(value);
        }} 
      />
      
      {/* Past event presets */}
      <PastEventsPresets 
        visible={showPastPresets}
        onPresetClick={(preset) => {
          handlePresetClick(preset);
          setFilterValue(preset);
        }}
      />
      
      {/* Upcoming event presets */}
      <UpcomingEventsPresets 
        visible={showUpcomingPresets}
        onPresetClick={(preset) => {
          handlePresetClick(preset);
          setFilterValue(preset);
        }}
      />
    </div>
  );
}
