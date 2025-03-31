
import { useState, useEffect } from "react";
import { Notification, NotificationType } from "./NotificationTypes";
import { useTodoItems } from "@/hooks/useTodoItems";
import { useAgenda } from "@/hooks/useAgenda";
import { isPast, isToday, addDays } from "date-fns";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { todoItems } = useTodoItems();
  const { agendaItems } = useAgenda();
  const { user } = useAuth();

  // Fetch read notification states from database
  const fetchReadNotifications = async () => {
    try {
      const readStatesMap: Record<string, boolean> = {};
      
      let query = supabase
        .from('notification_read_states')
        .select('notification_id, read');

      // If user is logged in, query by user_id, otherwise query for null user_id
      if (user?.id) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching read notification states:', error);
        return {};
      }
      
      if (data) {
        data.forEach(item => {
          readStatesMap[item.notification_id] = item.read;
        });
      }
      
      return readStatesMap;
    } catch (err) {
      console.error('Error in fetchReadNotifications:', err);
      return {};
    }
  };

  // Mark notification as read in database
  const saveReadNotification = async (notificationId: string, isRead: boolean = true) => {
    try {
      // Check if the notification read state already exists
      const { data: existingData, error: existingError } = await supabase
        .from('notification_read_states')
        .select('id')
        .eq('notification_id', notificationId)
        .eq('user_id', user?.id || null)
        .maybeSingle();

      if (existingError) {
        console.error('Error checking for existing read state:', existingError);
        return;
      }

      if (existingData) {
        // Update existing read state
        const { error } = await supabase
          .from('notification_read_states')
          .update({ read: isRead })
          .eq('id', existingData.id);

        if (error) {
          console.error('Error updating read notification state:', error);
        }
      } else {
        // Insert new read state
        const { error } = await supabase
          .from('notification_read_states')
          .insert({
            notification_id: notificationId,
            user_id: user?.id || null,
            read: isRead
          });

        if (error) {
          console.error('Error saving read notification state:', error);
        }
      }
    } catch (err) {
      console.error('Error in saveReadNotification:', err);
    }
  };

  // Delete notification read state from database
  const deleteReadNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notification_read_states')
        .delete()
        .eq('notification_id', notificationId)
        .eq('user_id', user?.id || null);

      if (error) {
        console.error('Error deleting read notification state:', error);
      }
    } catch (err) {
      console.error('Error in deleteReadNotification:', err);
    }
  };

  // Generate notifications from todo items and agenda items
  useEffect(() => {
    const loadNotificationsWithReadStates = async () => {
      const readNotifications = await fetchReadNotifications();
      const newNotifications: Notification[] = [];
      
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
              read: readNotifications[notificationId] || false
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
              read: readNotifications[notificationId] || false
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
            read: readNotifications[notificationId] || false
          });
        }
      });
      
      // Add some sample mock notifications for demonstration (can be removed in production)
      if (newNotifications.length < 2) {
        const mockNotifications = [
          {
            id: 'assignment-1',
            type: 'assignment' as NotificationType,
            message: 'You have been assigned to Property #12345',
            title: 'Property Assignment',
            date: new Date('2023-08-15T10:30:00Z'),
            read: readNotifications['assignment-1'] || false,
            propertyId: '12345',
            propertyTitle: 'Luxury Villa'
          },
          {
            id: 'change-2',
            type: 'change' as NotificationType,
            message: 'Property #54321 has been updated',
            title: 'Property Update',
            date: new Date('2023-08-14T14:20:00Z'),
            read: readNotifications['change-2'] || false,
            propertyId: '54321',
            propertyTitle: 'City Apartment'
          }
        ];
        
        newNotifications.push(...mockNotifications);
      }
      
      // Sort notifications based on current sort order preference
      const sortedNotifications = sortNotifications(newNotifications, sortOrder);
      
      setNotifications(sortedNotifications);
    };
    
    loadNotificationsWithReadStates();
  }, [todoItems, agendaItems, sortOrder, user?.id]);

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
  const markAsRead = async (id: string) => {
    // Update notifications in state
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    
    // Update in database
    await saveReadNotification(id, true);
  };

  // Function to delete a notification
  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Remove from database
    await deleteReadNotification(id);
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
