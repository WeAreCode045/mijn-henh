
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { PropertyQuickNav } from "@/components/dashboard/PropertyQuickNav";
import { ActivityIndicators } from "@/components/dashboard/ActivityIndicators";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgendaCalendarView } from "@/components/dashboard/AgendaCalendarView";
import { useAgenda } from "@/hooks/useAgenda";

export default function Index() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const { agendaItems, isLoading } = useAgenda(propertyId || undefined);
  
  return (
    <div className="container mx-auto pt-4 pb-8">
      {/* Top nav section with search and activity indicators */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-1/2">
          <PropertyQuickNav />
        </div>
        <div>
          <ActivityIndicators />
        </div>
      </div>
      
      {/* Calendar Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <AgendaCalendarView 
              agendaItems={agendaItems} 
              isLoading={isLoading}
              onItemClick={() => {}}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">{agendaItems.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Tabs (full width) */}
      <div className="grid grid-cols-1 gap-6">
        <DashboardTabs />
      </div>
    </div>
  );
}
