
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { WeeklyCalendarView } from "../weekly-calendar";

interface WeeklyViewContentProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
  onEventUpdate?: (item: AgendaItem, newDate: string, newTime: string) => void;
}

export function WeeklyViewContent({
  agendaItems,
  isLoading,
  onItemClick,
  onEventUpdate
}: WeeklyViewContentProps) {
  return (
    <WeeklyCalendarView
      agendaItems={agendaItems}
      isLoading={isLoading}
      onItemClick={onItemClick}
      onEventUpdate={onEventUpdate}
    />
  );
}
