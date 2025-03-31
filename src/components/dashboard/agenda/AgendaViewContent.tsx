
import { DateRange } from "react-day-picker";
import { EmptyAgendaNotification } from "./EmptyAgendaNotification";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { AgendaListView } from "./list-view";

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
  let itemsToDisplay = filteredAgendaItems || [];
  
  // Always check if safeAgendaItems exists before checking its length
  const hasItems = safeAgendaItems && safeAgendaItems.length > 0;
  console.log("AgendaViewContent - hasItems:", hasItems, "itemsToDisplay:", itemsToDisplay.length);
  
  return (
    <div className="space-y-4">
      {isLoading ? (
        // Loading spinner
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : !hasItems ? (
        // Empty agenda notification
        <EmptyAgendaNotification onAddClick={onAddClick} />
      ) : (
        // Use the AgendaListView component
        <AgendaListView 
          agendaItems={safeAgendaItems} // Pass all items and let the AgendaListView handle filtering
          isLoading={isLoading}
          onItemClick={onItemClick}
          onAddClick={onAddClick}
        />
      )}
    </div>
  );
}
