
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangeSelector } from "@/components/property/dashboard/agenda/DateRangeSelector";
import { AgendaItemList } from "@/components/property/dashboard/agenda/AgendaItemList";
import { AgendaCalendarView } from "./AgendaCalendarView";
import { EmptyAgendaNotification } from "./EmptyAgendaNotification";
import { AgendaItem, DateRange } from "@/components/property/dashboard/agenda/types";

interface AgendaViewContentProps {
  view: "calendar" | "list";
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick?: (e: React.MouseEvent) => void;
}

export function AgendaViewContent({
  view,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick,
  onAddClick
}: AgendaViewContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (!safeAgendaItems || safeAgendaItems.length === 0) {
    return <EmptyAgendaNotification onAddClick={onAddClick || (() => {})} />;
  }

  // Check if we have items after filtering
  const hasFilteredItems = filteredAgendaItems && filteredAgendaItems.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Your Agenda</h4>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      {view === "calendar" ? (
        <AgendaCalendarView 
          agendaItems={filteredAgendaItems} 
          isLoading={false}
          onDayClick={undefined}
        />
      ) : (
        hasFilteredItems ? (
          <AgendaItemList 
            filteredAgendaItems={filteredAgendaItems} 
            isLoading={false} 
            onItemClick={onItemClick} 
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No agenda items found for the selected period.
          </div>
        )
      )}
    </div>
  );
}
