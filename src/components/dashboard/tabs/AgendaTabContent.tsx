
import { AgendaSection } from "../agenda/AgendaSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { useState } from "react";
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

export function AgendaTabContent(props?: AgendaTabContentProps) {
  const [activeTab, setActiveTab] = useState("calendar");
  const { agendaItems, isLoading } = useAgenda();
  
  // If props are provided, use them; otherwise use local state
  const { dateRange, setDateRange, filteredAgendaItems } = 
    props || useAgendaFiltering(agendaItems);
  
  // Use provided safe items or create default
  const safeAgendaItems = props?.safeAgendaItems || agendaItems || [];

  return (
    <>
      {props ? (
        <AgendaSection />
      ) : (
        <>
          <AgendaSection />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
    </>
  );
}
