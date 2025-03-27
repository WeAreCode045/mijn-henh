
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

export function DashboardTabs() {
  const { activeTab, handleTabChange, propertyId } = useDashboardTabs();
  
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
          <AgendaTabContent />
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
