
import { useState } from "react";
import { X, Calendar, CheckSquare, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Upcoming Event",
      message: "Property showing at 123 Main St tomorrow at 2 PM",
      type: "agenda",
      date: new Date(Date.now() + 86400000), // tomorrow
      read: false,
    },
    {
      id: "2",
      title: "Overdue Task",
      message: "Call back client about property listing",
      type: "todo",
      date: new Date(Date.now() - 86400000), // yesterday
      read: false,
    },
    {
      id: "3",
      title: "New Message",
      message: "You received a new inquiry about 456 Oak Ave",
      type: "communication",
      date: new Date(),
      read: true,
    },
  ]);

  // Delete a notification
  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Mark a notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No notifications
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`p-3 rounded-md relative border ${notification.read ? 'bg-background' : 'bg-accent/50'}`}
          onClick={() => handleMarkAsRead(notification.id)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 absolute top-1 right-1"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNotification(notification.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
          
          <div className="flex items-start mb-1">
            {notification.type === "agenda" && <Calendar className="h-4 w-4 mr-2 text-blue-500" />}
            {notification.type === "todo" && <CheckSquare className="h-4 w-4 mr-2 text-green-500" />}
            {notification.type === "communication" && <MessageSquare className="h-4 w-4 mr-2 text-amber-500" />}
            {notification.type === "system" && <Bell className="h-4 w-4 mr-2 text-purple-500" />}
            <span className="font-medium">{notification.title}</span>
          </div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.date.toLocaleString()}
          </p>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-blue-500 absolute top-3 right-8"></div>
          )}
        </div>
      ))}
    </div>
  );
}
