
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
  
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!agendaItems || agendaItems.length === 0) {
    return <NoEventsMessage />;
  }

  // Apply time filter (past, day, week, month, all)
  const filteredItems = filterValue 
    ? filterByTimeRange(agendaItems, filterValue) 
    : filterByTimeRange(agendaItems, showPastEvents ? 'past' : 'all');

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
