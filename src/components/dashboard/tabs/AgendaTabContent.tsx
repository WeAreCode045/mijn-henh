
import { AgendaSection } from "../agenda/AgendaSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { useState } from "react";

export function AgendaTabContent() {
  const { agendaItems, isLoading } = useAgenda();
  const { dateRange, setDateRange, filteredAgendaItems } = useAgendaFiltering(agendaItems);
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <>
      <AgendaSection 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        safeAgendaItems={agendaItems}
        isLoading={isLoading}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filteredAgendaItems={filteredAgendaItems}
      />
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
  );
}
