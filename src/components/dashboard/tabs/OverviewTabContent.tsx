
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentProperties } from "../RecentProperties";
import { TodoSection } from "../TodoSection";
import { RecentSubmissions } from "../RecentSubmissions";
import { CompactNotificationsBar } from "../CompactNotificationsBar";

export function OverviewTabContent() {
  return (
    <CardContent className="p-6">
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
        <CompactNotificationsBar />
      </div>

      {/* Original content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentProperties />
        <div className="space-y-6">
          <TodoSection />
          <RecentSubmissions />
        </div>
      </div>
    </CardContent>
  );
}
