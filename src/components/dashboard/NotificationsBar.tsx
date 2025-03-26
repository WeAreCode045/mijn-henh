
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Calendar, CheckSquare, MessageSquare, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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

export function NotificationsBar() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const { toast } = useToast();
  const { todoItems } = useTodoItems();
  const { agendaItems } = useAgenda();
  
  // Sound effect for new notifications
  const playNotificationSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.play().catch(error => {
      console.log("Audio play failed:", error);
    });
  };
  
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
    
    // Check if we have new notifications
    if (
      newNotifications.length > notifications.length && 
      notifications.length > 0
    ) {
      playNotificationSound();
      toast({
        title: "New Notification",
        description: newNotifications[0].message,
      });
    }
    
    setNotifications(newNotifications);
  }, [todoItems, agendaItems, toast]);
  
  // Delete a notification
  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Filter notifications
  const filteredNotifications = filter
    ? notifications.filter(notification => notification.type === filter)
    : notifications;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </span>
          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            {notifications.length}
          </span>
        </CardTitle>
        <Select onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter notifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All notifications</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="communication">Communications</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No notifications
          </div>
        ) : (
          filteredNotifications.map(notification => (
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
