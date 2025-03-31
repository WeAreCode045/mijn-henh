
import { Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { EmptyAgendaNotification } from "./EmptyAgendaNotification";
import { AgendaItemList } from "@/components/property/dashboard/agenda/AgendaItemList";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

interface AgendaViewContentProps {
  view: "list";
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick: () => void;
}

export function AgendaViewContent({
  view,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick,
  onAddClick,
}: AgendaViewContentProps) {
  // Make sure we always have an array, even if filteredAgendaItems is undefined
  const itemsToDisplay = filteredAgendaItems || [];
  
  // Always check if safeAgendaItems exists before checking its length
  const hasItems = safeAgendaItems && safeAgendaItems.length > 0;
  console.log("AgendaViewContent - hasItems:", hasItems);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setDateRange(undefined)}>
          <Filter className="h-4 w-4" />
          {dateRange ? "Clear Filter" : "All Events"}
        </Button>
      </div>
      
      {isLoading ? (
        // Loading spinner
        <div>Loading...</div>
      ) : !hasItems ? (
        // Empty agenda notification
        <EmptyAgendaNotification onAddClick={onAddClick} />
      ) : (
        // Use the AgendaItemList component to display items
        <AgendaItemList
          filteredAgendaItems={itemsToDisplay}
          isLoading={isLoading}
          onItemClick={onItemClick}
        />
      )}
    </div>
  );
}
