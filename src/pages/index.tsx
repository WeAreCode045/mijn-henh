
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { PropertyQuickNav } from "@/components/dashboard/PropertyQuickNav";
import { ActivityIndicators } from "@/components/dashboard/ActivityIndicators";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationsBar } from "@/components/dashboard/NotificationsBar";
import { UpcomingEvents } from "@/components/dashboard/agenda/UpcomingEvents";

export default function Index() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
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
      
      {/* Stats and Notifications Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Properties</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <NotificationsBar />
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
