
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDashboardTabs } from "./hooks/useDashboardTabs";
import { TabsList } from "./tabs/TabsList";
import { OverviewTabContent } from "./tabs/OverviewTabContent";
import { PropertiesTabContent } from "./tabs/PropertiesTabContent";
import { AgendaTabContent } from "./tabs/AgendaTabContent";
import { TodosTabContent } from "./tabs/TodosTabContent";
import { CommunicationsTabContent } from "./tabs/CommunicationsTabContent";
import { AnalyticsTabContent } from "./tabs/AnalyticsTabContent";
import { NotificationsTabContent } from "./tabs/NotificationsTabContent";
import { PropertyDetailsTabContent } from "./tabs/PropertyDetailsTabContent";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function DashboardTabs() {
  const { activeTab, handleTabChange, propertyId } = useDashboardTabs();
  
  // Default to weekly view
  const [agendaActiveTab, setAgendaActiveTab] = useState("weekly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Get agenda items and filtering functionality
  const { agendaItems, isLoading, addAgendaItem, updateAgendaItem, deleteAgendaItem } = useAgenda();
  const { filteredAgendaItems } = useAgendaFiltering(agendaItems || []);

  // Handle agenda item click
  const handleAgendaItemClick = (item: AgendaItem) => {
    console.log("Agenda item clicked:", item);
    // Implement any agenda item click handling here
  };

  // Handle add click
  const handleAddClick = () => {
    console.log("Add agenda item clicked");
    // Implement adding a new agenda item here
  };
  
  return (
    <Card>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList activeTab={activeTab} propertyId={propertyId} />
        
        <TabsContent value="overview">
          <OverviewTabContent />
        </TabsContent>
        
        <TabsContent value="properties">
          <PropertiesTabContent />
        </TabsContent>
        
        <TabsContent value="agenda">
          <AgendaTabContent 
            onTabChange={setAgendaActiveTab}
            safeAgendaItems={agendaItems || []}
            isLoading={isLoading}
            dateRange={dateRange || { from: undefined, to: undefined }}
            setDateRange={setDateRange}
            filteredAgendaItems={filteredAgendaItems}
            onItemClick={handleAgendaItemClick}
            onAddClick={handleAddClick}
          />
        </TabsContent>
        
        <TabsContent value="todos">
          <TodosTabContent />
        </TabsContent>
        
        <TabsContent value="comms">
          <CommunicationsTabContent />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTabContent />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTabContent />
        </TabsContent>

        <TabsContent value="property">
          <PropertyDetailsTabContent />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
