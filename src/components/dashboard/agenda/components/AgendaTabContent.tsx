
import { TabsContent } from "@/components/ui/tabs";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { DateRange } from "react-day-picker";
import { WeeklyViewContent } from "./WeeklyViewContent";
import { ListViewContent } from "./ListViewContent";

interface AgendaTabContentProps {
  activeTab: string;
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick: () => void;
  onEventUpdate?: (item: AgendaItem, newDate: string, newTime: string) => void;
}

export function AgendaTabContent({
  activeTab,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick,
  onAddClick,
  onEventUpdate
}: AgendaTabContentProps) {
  return (
    <>
      <TabsContent value="weekly" className="mt-0">
        <WeeklyViewContent
          agendaItems={safeAgendaItems}
          isLoading={isLoading}
          onItemClick={onItemClick}
          onEventUpdate={onEventUpdate}
        />
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        <ListViewContent 
          agendaItems={safeAgendaItems}
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
