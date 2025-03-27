
import { AgendaCalendarView } from "./AgendaCalendarView";
import { EmptyAgendaNotification } from "./EmptyAgendaNotification";
import { DateRangeSelector } from "@/components/property/dashboard/agenda/DateRangeSelector";
import { AgendaItemList } from "@/components/property/dashboard/agenda/AgendaItemList";
import { AgendaItem, DateRange } from "@/components/property/dashboard/agenda/types";

interface AgendaViewContentProps {
  view: "calendar" | "list";
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaViewContent({
  view,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick
}: AgendaViewContentProps) {
  
  if (view === "calendar") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <AgendaCalendarView 
            agendaItems={safeAgendaItems} 
            isLoading={isLoading}
            onDayClick={() => {}}
            className="w-full"
            compactMode={true}
          />
        </div>
        <div className="md:col-span-3">
          {!isLoading && safeAgendaItems.length === 0 ? (
            <EmptyAgendaNotification onAddClick={(e) => onItemClick(e as unknown as AgendaItem)} />
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="flex justify-end">
                <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
              </div>
              <AgendaItemList 
                filteredAgendaItems={filteredAgendaItems} 
                isLoading={isLoading} 
                onItemClick={onItemClick}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // List view
  return (
    <>
      {!isLoading && safeAgendaItems.length === 0 ? (
        <EmptyAgendaNotification onAddClick={(e) => onItemClick(e as unknown as AgendaItem)} />
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex justify-end">
            <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          <AgendaItemList 
            filteredAgendaItems={filteredAgendaItems} 
            isLoading={isLoading} 
            onItemClick={onItemClick}
          />
        </div>
      )}
    </>
  );
}
