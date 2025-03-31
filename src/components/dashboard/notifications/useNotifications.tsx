
import { useState, useEffect } from "react";
import { NotificationType } from "./NotificationTypes";
import { useTodoItems } from "@/hooks/useTodoItems";
import { useAgenda } from "@/hooks/useAgenda";
import { isPast, isToday, addDays, format } from "date-fns";
import { useAuth } from "@/providers/AuthProvider";
import { useNotificationStore } from "./useNotificationStore";
import { useReadStateManager } from "./useReadStateManager";
import { useDatabaseNotifications } from "./useDatabaseNotifications";
import { useEventEmitter } from "./useEventEmitter";

export function useNotifications() {
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const { notifications, setNotifications, filteredNotifications } = useNotificationStore(sortOrder, filterType);
  const { loadReadStates, toggleReadStatus, deleteNotification } = useReadStateManager(setNotifications);
  const { fetchDatabaseNotifications } = useDatabaseNotifications();
  const { emitNotificationUpdate } = useEventEmitter();
  
  const { todoItems } = useTodoItems();
  const { agendaItems } = useAgenda();
  const { user } = useAuth();

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Generate notifications from todo items, agenda items, and database
  useEffect(() => {
    const loadNotifications = async () => {
      const readStates = await loadReadStates();
      const dbNotifications = await fetchDatabaseNotifications();
      const newNotifications = [];
      
      // Process todo items
      todoItems.forEach(todo => {
        // Add notification for due items
        if (todo.due_date && !todo.completed) {
          const dueDate = new Date(todo.due_date);
          if (isPast(dueDate) && !isToday(dueDate)) {
            const notificationId = `todo-due-${todo.id}`;
            newNotifications.push({
              id: notificationId,
              title: "Overdue Task",
              message: `Task "${todo.title}" is overdue`,
              type: "todo",
              date: new Date(),
              read: readStates[notificationId] || false
            });
          }
        }
        
        // Add notification for upcoming notification times
        if (todo.notify_at && !todo.notification_sent) {
          const notifyDate = new Date(todo.notify_at);
          if (isPast(notifyDate) || isToday(notifyDate)) {
            const notificationId = `todo-notify-${todo.id}`;
            newNotifications.push({
              id: notificationId,
              title: "Task Reminder",
              message: `Reminder for "${todo.title}"`,
              type: "todo",
              date: notifyDate,
              read: readStates[notificationId] || false
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
          const notificationId = `agenda-${agenda.id}`;
          newNotifications.push({
            id: notificationId,
            title: "Upcoming Event",
            message: `${agenda.title} on ${format(eventDate, "PPP")} at ${format(eventDate, "p")}`,
            type: "agenda",
            date: eventDate,
            read: readStates[notificationId] || false
          });
        }
      });
      
      // Process database notifications
      if (dbNotifications.length > 0) {
        dbNotifications.forEach(notification => {
          const notificationId = notification.id;
          newNotifications.push({
            id: notificationId,
            title: notification.title,
            message: notification.message,
            type: notification.type as NotificationType,
            date: new Date(notification.created_at),
            read: readStates[notificationId] || false,
            // Only add these properties if they exist in the notification
            ...(notification.property_id && { propertyId: notification.property_id }),
            ...(notification.property_title && { propertyTitle: notification.property_title })
          });
        });
      }
      
      // Add some sample mock notifications for demonstration if needed
      if (newNotifications.length < 2) {
        const mockNotifications = [
          {
            id: 'assignment-1',
            type: 'assignment' as NotificationType,
            message: 'You have been assigned to Property #12345',
            title: 'Property Assignment',
            date: new Date('2023-08-15T10:30:00Z'),
            read: readStates['assignment-1'] || false,
            propertyId: '12345',
            propertyTitle: 'Luxury Villa'
          },
          {
            id: 'change-2',
            type: 'change' as NotificationType,
            message: 'Property #54321 has been updated',
            title: 'Property Update',
            date: new Date('2023-08-14T14:20:00Z'),
            read: readStates['change-2'] || false,
            propertyId: '54321',
            propertyTitle: 'City Apartment'
          }
        ];
        
        newNotifications.push(...mockNotifications);
      }
      
      // Sort and set notifications
      const sortedNotifications = sortNotifications(newNotifications, sortOrder);
      setNotifications(sortedNotifications);
      
      // Emit the unread count for the ActivityIndicators component
      emitNotificationUpdate(sortedNotifications.filter(n => !n.read).length);
    };
    
    loadNotifications();
  }, [todoItems, agendaItems, sortOrder, user]);

  // Helper function to sort notifications
  const sortNotifications = (notifs, order) => {
    return [...notifs].sort((a, b) => {
      if (order === 'newest') {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.date.getTime() - b.date.getTime();
      }
    });
  };

  // Enhanced toggle function that emits the updated unread count
  const handleToggleReadStatus = async (id) => {
    await toggleReadStatus(id);
    // After toggle, emit the updated count
    emitNotificationUpdate(notifications.filter(n => !n.read).length);
  };

  // Enhanced delete function that emits the updated unread count
  const handleDeleteNotification = async (id) => {
    await deleteNotification(id);
    // After deletion, emit the updated count
    emitNotificationUpdate(notifications.filter(n => !n.read).length);
  };

  // Get notification type counts for filter selector
  const getTypeCount = (type) => {
    if (type === 'all') return notifications.length;
    return notifications.filter(n => n.type === type).length;
  };

  return {
    notifications: filteredNotifications,
    filterType,
    setFilterType,
    sortOrder,
    setSortOrder,
    toggleReadStatus: handleToggleReadStatus,
    deleteNotification: handleDeleteNotification,
    getTypeCount,
    unreadCount
  };
}
