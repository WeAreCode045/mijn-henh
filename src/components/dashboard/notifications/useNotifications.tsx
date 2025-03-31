
import { useState, useEffect } from "react";
import { Notification, NotificationType } from "./NotificationTypes";
import { useTodoItems } from "@/hooks/useTodoItems";
import { useAgenda } from "@/hooks/useAgenda";
import { isPast, isToday, addDays } from "date-fns";
import { format } from "date-fns";

export function useNotifications() {
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
  }, [todoItems, agendaItems, sortOrder]);

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
  };

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

  // Get notification type counts for filter selector
  const getTypeCount = (type: NotificationType | 'all') => {
    if (type === 'all') return notifications.length;
    return notifications.filter(n => n.type === type).length;
  };

  return {
    notifications: filteredNotifications,
    filterType,
    setFilterType,
    sortOrder,
    setSortOrder,
    markAsRead,
    deleteNotification,
    getTypeCount
  };
}
