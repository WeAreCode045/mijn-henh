
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentProperties } from "../RecentProperties";
import { TodoSection } from "../TodoSection";
import { RecentSubmissions } from "../RecentSubmissions";
import { CompactNotificationsBar } from "../CompactNotificationsBar";
import { useEffect, useState } from "react";
import { useAgenda } from "@/hooks/useAgenda";
import { useTodoItems } from "@/hooks/useTodoItems";
import { useProperties } from "@/hooks/useProperties";
import { isToday, parseISO } from "date-fns";

export function OverviewTabContent() {
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [propertyCount, setPropertyCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  
  // Fetch agenda items
  const { agendaItems } = useAgenda();
  
  // Fetch todo items
  const { todoItems } = useTodoItems();
  
  // Fetch properties
  const { properties } = useProperties();

  // Calculate stats
  useEffect(() => {
    // Count upcoming events (today and future)
    const upcomingCount = agendaItems.filter(item => {
      if (!item.event_date) return false;
      const eventDate = parseISO(item.event_date);
      return isToday(eventDate) || eventDate > new Date();
    }).length;
    setUpcomingEvents(upcomingCount);
    
    // Count pending tasks (not completed)
    const pendingCount = todoItems.filter(item => !item.completed).length;
    setPendingTasks(pendingCount);
    
    // Set property count
    setPropertyCount(properties.length);
    
    // Message count (mocked for now - would need to be connected to actual comms system)
    setMessageCount(0);
  }, [agendaItems, todoItems, properties]);

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
                <p className="text-2xl font-bold">{upcomingEvents}</p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">{pendingTasks}</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">{propertyCount}</p>
                <p className="text-sm text-muted-foreground">Properties</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <p className="text-2xl font-bold">{messageCount}</p>
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
