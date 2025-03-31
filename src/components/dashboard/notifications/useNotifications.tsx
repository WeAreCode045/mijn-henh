
import { useState, useEffect } from "react";
import { Notification, NotificationType } from "./NotificationTypes";
import { useTodoItems } from "@/hooks/useTodoItems";
import { useAgenda } from "@/hooks/useAgenda";
import { isPast, isToday, addDays } from "date-fns";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

// Define the database notification type
interface DbNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  updated_at: string;
  property_id?: string;
  property_title?: string;
}

// Define the read state map
interface ReadStateMap {
  [key: string]: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { todoItems } = useTodoItems();
  const { agendaItems } = useAgenda();
  const { user } = useAuth();

  // Fetch notifications from database
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return (data || []) as DbNotification[];
    } catch (err) {
      console.error('Error in fetchNotifications:', err);
      return [];
    }
  };

  // Fetch user's read notification states
  const fetchUserReadStates = async () => {
    if (!user) {
      return {};
    }
    
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('user_notifications')
        .eq('id', user.id)
        .single();
      
      if (userProfile?.user_notifications) {
        // Check if user_notifications is an array before using reduce
        if (Array.isArray(userProfile.user_notifications)) {
          return userProfile.user_notifications.reduce((acc: Record<string, boolean>, item: any) => {
            acc[item.id] = item.read || false;
            return acc;
          }, {});
        } else {
          console.error('user_notifications is not an array:', userProfile.user_notifications);
          return {};
        }
      }
      return {};
    } catch (err) {
      console.error('Error loading read notifications from database:', err);
      return {};
    }
  };

  // Save read notifications to database
  const saveReadNotifications = async (readMap: Record<string, boolean>) => {
    if (!user) {
      return;
    }
    
    try {
      // Convert read state map to array format for storage
      const notificationArray = Object.entries(readMap).map(([id, read]) => ({
        id,
        read
      }));
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          user_notifications: notificationArray 
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error saving read notifications to database:', error);
      }
    } catch (err) {
      console.error('Error in saveReadNotifications:', err);
    }
  };

  // Generate notifications from todo items, agenda items, and database
  useEffect(() => {
    const loadNotifications = async () => {
      // Load read states from database
      const readNotifications = await fetchUserReadStates();
      const dbNotifications = await fetchNotifications();
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
            read: readNotifications[notificationId] || false,
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
    
    loadNotifications();
  }, [todoItems, agendaItems, sortOrder, user]);

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
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update read states
    const readStates = await fetchUserReadStates();
    const updatedReadStates: ReadStateMap = typeof readStates === 'object' ? { ...readStates } : {};
    updatedReadStates[id] = true;
    await saveReadNotifications(updatedReadStates);
  };

  // Function to delete a notification
  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Update read states in database
    const readStates = await fetchUserReadStates();
    const updatedReadStates: ReadStateMap = typeof readStates === 'object' ? { ...readStates } : {};
    delete updatedReadStates[id];
    await saveReadNotifications(updatedReadStates);
    
    // If it's a database notification, delete it
    if (!id.includes('-')) {
      try {
        await supabase
          .from('notifications')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Error deleting notification from database:', err);
      }
    }
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
