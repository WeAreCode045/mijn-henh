
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

export function DashboardTabs() {
  const { activeTab, handleTabChange, propertyId } = useDashboardTabs();
  
  // Add state and handlers for AgendaTabContent
  const [agendaActiveTab, setAgendaActiveTab] = useState("calendar");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
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
            safeAgendaItems={[]}
            isLoading={false}
            dateRange={dateRange || { from: undefined, to: undefined }}
            setDateRange={setDateRange}
            filteredAgendaItems={[]}
            onItemClick={() => {}}
            onAddClick={() => {}}
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
