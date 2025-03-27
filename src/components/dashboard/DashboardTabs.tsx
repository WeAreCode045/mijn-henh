
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentProperties } from "./RecentProperties";
import { AgendaSection } from "./agenda/AgendaSection";
import { RecentSubmissions } from "./RecentSubmissions";
import { TodoSection } from "./TodoSection";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { CommunicationsSection } from "./CommunicationsSection";
import { UnderConstructionView } from "./UnderConstructionView";
import { NotificationsSection } from "./NotificationsSection";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  
  // Check for tab parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'properties', 'agenda', 'todos', 'comms', 'analytics', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex justify-start border-b px-4 pt-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="comms">Communications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <RecentProperties />
            <div className="space-y-6">
              <TodoSection />
              <RecentSubmissions />
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="properties">
          <CardContent className="p-6">
            <RecentProperties fullWidth={true} showAddButton={true} />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="agenda">
          <AgendaSection />
        </TabsContent>
        
        <TabsContent value="todos">
          <CardContent className="p-6">
            <TodoSection fullWidth={true} />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="comms">
          <CardContent className="p-6">
            <CommunicationsSection />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="analytics">
          <CardContent className="p-6">
            <AnalyticsOverview />
          </CardContent>
        </TabsContent>

        <TabsContent value="notifications">
          <CardContent className="p-6">
            <NotificationsSection />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
