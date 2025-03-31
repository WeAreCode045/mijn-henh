
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { FilterControls } from "./FilterControls";
import { EventGroups } from "./EventGroups";
import { useState } from "react";
import { NoEventsMessage } from "./NoEventsMessage";
import { LoadingIndicator } from "./LoadingIndicator";
import { filterByTimeRange } from "./utils";

interface AgendaListViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaListView({ 
  agendaItems, 
  isLoading,
  onItemClick
}: AgendaListViewProps) {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [filterValue, setFilterValue] = useState<string | undefined>(undefined);
  
  // Add some debug logs
  console.log("AgendaListView - agendaItems:", agendaItems);
  console.log("AgendaListView - isLoading:", isLoading);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!agendaItems || agendaItems.length === 0) {
    return <NoEventsMessage />;
  }

  // Filter items based on show past events toggle
  const filteredByPast = showPastEvents 
    ? agendaItems 
    : agendaItems.filter(item => {
        if (!item.event_date) return false;
        const eventDate = new Date(item.event_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
  
  // Apply time filter (day, week, month, all)
  const filteredItems = filterValue ? filterByTimeRange(filteredByPast, filterValue) : filteredByPast;

  // If no items match the filter criteria
  if (filteredItems.length === 0) {
    return (
      <div className="space-y-4">
        <FilterControls 
          showPastEvents={showPastEvents}
          setShowPastEvents={setShowPastEvents}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
        <NoEventsMessage isFiltered />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterControls 
        showPastEvents={showPastEvents}
        setShowPastEvents={setShowPastEvents}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <EventGroups 
        filteredItems={filteredItems} 
        onItemClick={onItemClick}
        showPastEvents={showPastEvents}
      />
    </div>
  );
}
