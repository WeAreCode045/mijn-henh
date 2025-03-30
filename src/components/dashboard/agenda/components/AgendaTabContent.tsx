
import { TabsContent } from "@/components/ui/tabs";
import { AgendaViewContent } from "../AgendaViewContent";
import { WeeklyCalendarView } from "../weekly-calendar";
import { MonthlyCalendarView } from "../monthly-calendar/MonthlyCalendarView";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { DateRange } from "react-day-picker";

interface AgendaTabContentProps {
  activeTab: string;
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick: () => void;
}

export function AgendaTabContent({
  activeTab,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick,
  onAddClick
}: AgendaTabContentProps) {
  return (
    <>
      <TabsContent value="day" className="mt-0">
        <WeeklyCalendarView
          agendaItems={safeAgendaItems}
          isLoading={isLoading}
          onItemClick={onItemClick}
          viewMode="day"
        />
      </TabsContent>
      
      <TabsContent value="weekly" className="mt-0">
        <WeeklyCalendarView
          agendaItems={safeAgendaItems}
          isLoading={isLoading}
          onItemClick={onItemClick}
          viewMode="week"
        />
      </TabsContent>
      
      <TabsContent value="monthly" className="mt-0">
        <MonthlyCalendarView
          agendaItems={safeAgendaItems}
          isLoading={isLoading}
          onItemClick={onItemClick}
        />
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        <AgendaViewContent 
          view="list"
          safeAgendaItems={safeAgendaItems}
          isLoading={isLoading}
          dateRange={dateRange}
          setDateRange={setDateRange}
          filteredAgendaItems={filteredAgendaItems}
          onItemClick={onItemClick}
          onAddClick={onAddClick}
        />
      </TabsContent>
    </>
  );
}
