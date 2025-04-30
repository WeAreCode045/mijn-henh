
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "./NotificationTypes";

interface ReadStateMap {
  [key: string]: boolean;
}

export function useReadStateManager(
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) {
  const { user } = useAuth();

  // Fetch user's read notification states from local storage
  const loadReadStates = async () => {
    if (!user) {
      return {};
    }
    
    try {
      // Use local storage implementation since employer_profiles doesn't have user_notifications field
      const storedData = localStorage.getItem(`user_notifications_${user.id}`);
      if (storedData) {
        const notificationArray = JSON.parse(storedData);
        const readStates: ReadStateMap = {};
        notificationArray.forEach((item: {id: string, read: boolean}) => {
          readStates[item.id] = item.read;
        });
        return readStates;
      }
      
      return {};
    } catch (err) {
      console.error('Error loading read notifications from local storage:', err);
      return {};
    }
  };

  // Save read notifications to local storage
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
      
      // Save to local storage
      localStorage.setItem(`user_notifications_${user.id}`, JSON.stringify(notificationArray));
      
    } catch (err) {
      console.error('Error in saveReadNotifications:', err);
    }
  };

  // Toggle notification read status
  const toggleReadStatus = async (id: string) => {
    // Find the notification and toggle its read status
    setNotifications(prevNotifications => {
      const updatedNotifications = prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: !notification.read } : notification
      );
      return updatedNotifications;
    });
    
    // Get the notification to find its current read state
    const readStates = await loadReadStates();
    // Create a new ReadStateMap with the correct type
    const updatedReadStates: ReadStateMap = {};
    
    // Convert the read states to the correct type
    if (readStates && typeof readStates === 'object') {
      Object.keys(readStates).forEach(key => {
        // Make sure we're only adding boolean values
        updatedReadStates[key] = Boolean(readStates[key]);
      });
    }
    
    // Toggle this specific notification's read state
    setNotifications(currentNotifications => {
      const notification = currentNotifications.find(n => n.id === id);
      if (notification) {
        updatedReadStates[id] = notification.read;
      }
      return currentNotifications;
    });
    
    await saveReadNotifications(updatedReadStates);
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Update read states in database
    const readStates = await loadReadStates();
    // Create a new ReadStateMap with the correct type
    const updatedReadStates: ReadStateMap = {};
    
    // Convert the read states to the correct type
    if (readStates && typeof readStates === 'object') {
      Object.keys(readStates).forEach(key => {
        // Skip the notification being deleted
        if (key !== id) {
          // Make sure we're only adding boolean values
          updatedReadStates[key] = Boolean(readStates[key]);
        }
      });
    }
    
    await saveReadNotifications(updatedReadStates);
  };

  return {
    loadReadStates,
    toggleReadStatus,
    deleteNotification
  };
}
