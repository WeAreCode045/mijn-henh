
import { AgendaSection } from "../agenda/AgendaSection";
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { DateRange } from "react-day-picker";

interface AgendaTabContentProps {
  onTabChange: (value: string) => void;
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick?: (item: AgendaItem) => void;
  onAddClick?: () => void;
}

export function AgendaTabContent({
  onTabChange,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick = () => {},
  onAddClick = () => {}
}: AgendaTabContentProps) {
  return (
    <AgendaSection />
  );
}
