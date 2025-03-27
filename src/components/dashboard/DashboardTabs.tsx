
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PropertyFormContainer } from "@/pages/property/PropertyFormContainer";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  const navigate = useNavigate();
  const { id: propertyId } = useParams();
  
  // Check for tab parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'properties', 'agenda', 'todos', 'comms', 'analytics', 'notifications', 'property'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (propertyId) {
      // If we have a property ID in the URL but no tab specified, we should show the property tab
      setActiveTab("property");
    }
  }, [location, propertyId]);

  // Handle tab changes, updating the URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL with tab parameter
    const searchParams = new URLSearchParams(location.search);
    if (value !== "property") {
      searchParams.set('tab', value);
      navigate({ search: searchParams.toString() });
    }
  };

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full flex justify-start border-b px-4 pt-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="comms">Communications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {propertyId && <TabsTrigger value="property">Property Details</TabsTrigger>}
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

        {propertyId && (
          <TabsContent value="property">
            <CardContent className="p-6">
              <PropertyFormContainer />
            </CardContent>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
