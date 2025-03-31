
import { DateRange } from "react-day-picker";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { AgendaViewContent } from "../AgendaViewContent";

interface ListViewContentProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick: () => void;
}

export function ListViewContent({
  agendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick,
  onAddClick
}: ListViewContentProps) {
  return (
    <AgendaViewContent 
      view="list"
      safeAgendaItems={agendaItems}
      isLoading={isLoading}
      dateRange={dateRange}
      setDateRange={setDateRange}
      filteredAgendaItems={filteredAgendaItems}
      onItemClick={onItemClick}
      onAddClick={onAddClick}
    />
  );
}
