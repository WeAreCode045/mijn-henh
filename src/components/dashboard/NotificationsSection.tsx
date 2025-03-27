
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bell, Calendar, CheckSquare, Users, Edit } from "lucide-react";
import { useState } from "react";

// Define notification type
type NotificationType = 'assignment' | 'change' | 'agenda' | 'todo';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  propertyId?: string;
  propertyTitle?: string;
}

export function NotificationsSection() {
  // Mock notifications data - in a real app, you would fetch these from a backend
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assignment',
      message: 'You have been assigned to Property #12345',
      timestamp: '2023-08-15T10:30:00Z',
      read: false,
      propertyId: '12345',
      propertyTitle: 'Luxury Villa'
    },
    {
      id: '2',
      type: 'change',
      message: 'Property #54321 has been updated',
      timestamp: '2023-08-14T14:20:00Z',
      read: false,
      propertyId: '54321',
      propertyTitle: 'City Apartment'
    },
    {
      id: '3',
      type: 'agenda',
      message: 'New agenda item added to Property #12345',
      timestamp: '2023-08-13T09:15:00Z',
      read: true,
      propertyId: '12345',
      propertyTitle: 'Luxury Villa'
    },
    {
      id: '4',
      type: 'todo',
      message: 'New todo item added to Property #54321',
      timestamp: '2023-08-12T16:45:00Z',
      read: true,
      propertyId: '54321',
      propertyTitle: 'City Apartment'
    }
  ]);

  // Function to mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Function to get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'assignment':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'change':
        return <Edit className="h-5 w-5 text-amber-500" />;
      case 'agenda':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'todo':
        return <CheckSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format timestamp to a more readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" /> Notifications
        </CardTitle>
        <CardDescription>
          Stay updated with property changes and assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No notifications to display
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/30'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`${notification.read ? 'font-normal' : 'font-medium'}`}>{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        {notification.propertyTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
