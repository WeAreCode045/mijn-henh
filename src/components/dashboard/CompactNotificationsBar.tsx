
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, CheckSquare, MessageSquare, Bell, ChevronUp, ChevronDown } from "lucide-react";
import { useTodoItems } from "@/hooks/useTodoItems";
import { useAgenda } from "@/hooks/useAgenda";
import { format, isPast, isToday, addDays } from "date-fns";

// Interface for notification items
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "agenda" | "todo" | "communication" | "system";
  date: Date;
  read: boolean;
}

export function CompactNotificationsBar() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const { todoItems } = useTodoItems();
  const { agendaItems } = useAgenda();
  
  // Generate notifications from todo items and agenda items
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    // Process todo items
    todoItems.forEach(todo => {
      // Add notification for due items
      if (todo.due_date && !todo.completed) {
        const dueDate = new Date(todo.due_date);
        if (isPast(dueDate) && !isToday(dueDate)) {
          newNotifications.push({
            id: `todo-due-${todo.id}`,
            title: "Overdue Task",
            message: `Task "${todo.title}" is overdue`,
            type: "todo",
            date: new Date(),
            read: false
          });
        }
      }
      
      // Add notification for upcoming notification times
      if (todo.notify_at && !todo.notification_sent) {
        const notifyDate = new Date(todo.notify_at);
        if (isPast(notifyDate) || isToday(notifyDate)) {
          newNotifications.push({
            id: `todo-notify-${todo.id}`,
            title: "Task Reminder",
            message: `Reminder for "${todo.title}"`,
            type: "todo",
            date: notifyDate,
            read: false
          });
        }
      }
    });
    
    // Process agenda items
    agendaItems.forEach(agenda => {
      const eventDate = new Date(`${agenda.event_date}T${agenda.event_time}`);
      const today = new Date();
      const threeDaysFromNow = addDays(today, 3);
      
      // Only show notifications for upcoming events in the next 3 days
      if (eventDate > today && eventDate <= threeDaysFromNow) {
        newNotifications.push({
          id: `agenda-${agenda.id}`,
          title: "Upcoming Event",
          message: `${agenda.title} on ${format(eventDate, "PPP")} at ${format(eventDate, "p")}`,
          type: "agenda",
          date: eventDate,
          read: false
        });
      }
    });
    
    // Sort notifications by date
    newNotifications.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    setNotifications(newNotifications);
    setStartIndex(0); // Reset start index when notifications change
  }, [todoItems, agendaItems]);
  
  // Delete a notification
  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => {
      const newNotifications = prev.filter(notification => notification.id !== id);
      // Adjust startIndex if necessary
      if (startIndex >= newNotifications.length && startIndex > 0) {
        setStartIndex(Math.max(0, newNotifications.length - 3));
      }
      return newNotifications;
    });
  };

  const handlePrevious = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(notifications.length - 1, prev + 1));
  };

  // Get the current slice of notifications to display (max 3)
  const displayedNotifications = notifications.slice(startIndex, startIndex + 3);
  
  // Calculate if navigation buttons should be enabled
  const canGoUp = startIndex > 0;
  const canGoDown = startIndex + 3 < notifications.length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            {notifications.length}
          </span>
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevious}
            disabled={!canGoUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNext}
            disabled={!canGoDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayedNotifications.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No notifications
          </div>
        ) : (
          displayedNotifications.map(notification => (
            <div 
              key={notification.id} 
              className="p-3 bg-accent rounded-md relative border border-border"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-1 right-1"
                onClick={() => handleDeleteNotification(notification.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              
              <div className="flex items-start mb-1">
                {notification.type === "agenda" && <Calendar className="h-4 w-4 mr-2 text-blue-500" />}
                {notification.type === "todo" && <CheckSquare className="h-4 w-4 mr-2 text-green-500" />}
                {notification.type === "communication" && <MessageSquare className="h-4 w-4 mr-2 text-amber-500" />}
                <span className="font-medium">{notification.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(notification.date, "PPp")}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
