
import { supabase } from "@/integrations/supabase/client";

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

export function useDatabaseNotifications() {
  // Fetch notifications from database
  const fetchDatabaseNotifications = async () => {
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

  return {
    fetchDatabaseNotifications
  };
}
