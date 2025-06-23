
import { AgendaSection } from "@/components/dashboard/agenda/AgendaSection";
import { DateRange } from "react-day-picker";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

interface AgendaTabContentProps {
  onTabChange: (tab: string) => void;
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick: () => void;
}

export function AgendaTabContent(props: AgendaTabContentProps) {
  return (
    <div className="p-6">
      <AgendaSection {...props} />
    </div>
  );
}
