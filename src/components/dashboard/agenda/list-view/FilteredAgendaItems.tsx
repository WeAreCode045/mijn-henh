
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventGroups } from "./EventGroups";
import { NoEventsMessage } from "./NoEventsMessage";

interface FilteredAgendaItemsProps {
  originalItems: AgendaItem[];
  displayedItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick?: () => void;
}

export function FilteredAgendaItems({ 
  originalItems, 
  displayedItems, 
  onItemClick,
  onAddClick 
}: FilteredAgendaItemsProps) {
  if (!originalItems || originalItems.length === 0) {
    return <NoEventsMessage onAddClick={onAddClick} />;
  }
  
  if (displayedItems.length === 0) {
    return <NoEventsMessage isFiltered onAddClick={onAddClick} />;
  }
  
  return (
    <EventGroups 
      filteredItems={displayedItems} 
      onItemClick={onItemClick}
      showPastEvents={true}
    />
  );
}
