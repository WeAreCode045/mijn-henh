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

  // Fetch user's read notification states
  const loadReadStates = async () => {
    if (!user) {
      return {};
    }
    
    try {
      const { data: userProfile } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // Since the employer_profiles table doesn't have a user_notifications field,
      // we'll use a different approach - we could store this in local storage instead
      // or create a separate notifications table in the database
      
      // For now, return empty object as fallback
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
      
      // Instead of saving to employer_profiles, we could save to local storage
      // or a separate notifications table
      
      // For now, we'll just log that this functionality needs implementation
      console.log('Notification read states:', notificationArray);
      
      // Local storage implementation as temporary solution
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
    
    // If it's a database notification, delete it - but since we don't have a notifications table,
    // we'll just skip this part for now
    // The actual deletion would be uncommented when the notifications table is created
    /*
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
    */
  };

  return {
    loadReadStates,
    toggleReadStatus,
    deleteNotification
  };
}
