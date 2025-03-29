
import { Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { EmptyAgendaNotification } from "./EmptyAgendaNotification";
import { AgendaCalendarView } from "../AgendaCalendarView";
import { AgendaListView } from "../AgendaListView";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

interface AgendaViewContentProps {
  view: "calendar" | "list";
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
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setDateRange(undefined)}>
          <Filter className="h-4 w-4" />
          {dateRange ? "Clear Filter" : "All Events"}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : !hasItems ? (
        <EmptyAgendaNotification onAddClick={onAddClick} />
      ) : view === "calendar" ? (
        <div className="space-y-4">
          <AgendaCalendarView 
            agendaItems={itemsToDisplay}
            isLoading={false}
            onItemClick={onItemClick}
          />
          <div className="mt-4">
            <AgendaListView 
              agendaItems={itemsToDisplay}
              isLoading={false}
              onItemClick={onItemClick}
            />
          </div>
        </div>
      ) : (
        <AgendaListView 
          agendaItems={itemsToDisplay}
          isLoading={false}
          onItemClick={onItemClick}
        />
      )}
    </div>
  );
}
