
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AgendaViewContent } from "../agenda/AgendaViewContent";
import { WeeklyCalendarView } from "../agenda/weekly-calendar";
import { AgendaHeader } from "../agenda/components/AgendaHeader";

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
  // Set up state for active tab
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Handle tab change and propagate to parent
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };
  
  return (
    <div className="space-y-4">
      <AgendaHeader 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddButtonClick={onAddClick}
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsContent value="weekly" className="mt-0">
          <WeeklyCalendarView
            agendaItems={safeAgendaItems}
            isLoading={isLoading}
            onItemClick={onItemClick}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <AgendaViewContent 
            view="calendar"
            safeAgendaItems={safeAgendaItems}
            isLoading={isLoading}
            dateRange={dateRange}
            setDateRange={setDateRange}
            filteredAgendaItems={filteredAgendaItems}
            onItemClick={onItemClick}
            onAddClick={onAddClick}
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
      </Tabs>
    </div>
  );
}
