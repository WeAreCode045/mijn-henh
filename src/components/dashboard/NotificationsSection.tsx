
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bell, Calendar, CheckSquare, MessageSquare, Users, Edit, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useTodoItems } from "@/hooks/useTodoItems";
import { useAgenda } from "@/hooks/useAgenda";
import { isPast, isToday, addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define notification type
export type NotificationType = 'agenda' | 'todo' | 'communication' | 'system' | 'assignment' | 'change';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  propertyId?: string;
  propertyTitle?: string;
}

export function NotificationsSection() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
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
    
    // Add some sample mock notifications for demonstration (can be removed in production)
    if (newNotifications.length < 2) {
      newNotifications.push(
        {
          id: 'assignment-1',
          type: 'assignment',
          message: 'You have been assigned to Property #12345',
          title: 'Property Assignment',
          date: new Date('2023-08-15T10:30:00Z'),
          read: false,
          propertyId: '12345',
          propertyTitle: 'Luxury Villa'
        },
        {
          id: 'change-2',
          type: 'change',
          message: 'Property #54321 has been updated',
          title: 'Property Update',
          date: new Date('2023-08-14T14:20:00Z'),
          read: false,
          propertyId: '54321',
          propertyTitle: 'City Apartment'
        }
      );
    }
    
    // Sort notifications based on current sort order preference
    const sortedNotifications = sortNotifications(newNotifications, sortOrder);
    
    setNotifications(sortedNotifications);
  }, [todoItems, agendaItems]);

  // Apply filtering and sorting whenever notifications, filterType, or sortOrder change
  useEffect(() => {
    // Apply filters
    let filtered = notifications;
    
    if (filterType !== 'all') {
      filtered = notifications.filter(notification => notification.type === filterType);
    }
    
    // Apply sorting
    filtered = sortNotifications([...filtered], sortOrder);
    
    setFilteredNotifications(filtered);
  }, [notifications, filterType, sortOrder]);

  // Helper function to sort notifications
  const sortNotifications = (notifs: Notification[], order: 'newest' | 'oldest') => {
    return [...notifs].sort((a, b) => {
      if (order === 'newest') {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.date.getTime() - b.date.getTime();
      }
    });
  }

  // Function to mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Function to delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
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
      case 'communication':
        return <MessageSquare className="h-5 w-5 text-pink-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get notification type counts for filter selector
  const getTypeCount = (type: NotificationType | 'all') => {
    if (type === 'all') return notifications.length;
    return notifications.filter(n => n.type === type).length;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> All Notifications
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Type Filter Dropdown */}
            <Select 
              value={filterType} 
              onValueChange={(value) => setFilterType(value as NotificationType | 'all')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types ({getTypeCount('all')})</SelectItem>
                <SelectItem value="todo">Tasks ({getTypeCount('todo')})</SelectItem>
                <SelectItem value="agenda">Events ({getTypeCount('agenda')})</SelectItem>
                <SelectItem value="assignment">Assignments ({getTypeCount('assignment')})</SelectItem>
                <SelectItem value="change">Updates ({getTypeCount('change')})</SelectItem>
                <SelectItem value="communication">Messages ({getTypeCount('communication')})</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort Order Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  {sortOrder === 'newest' ? 'Newest' : 'Oldest'} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          Stay updated with property changes and assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {filterType !== 'all' 
              ? `No ${filterType} notifications to display` 
              : 'No notifications to display'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border relative ${notification.read ? 'bg-background' : 'bg-muted/30 border-muted'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className={`${notification.read ? 'font-normal' : 'font-medium'}`}>{notification.title}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-2 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the markAsRead
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        {notification.propertyTitle || ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(notification.date, "PPp")}
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
