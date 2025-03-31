
import { useState, useEffect } from "react";
import { Notification, NotificationType } from "./NotificationTypes";

export function useNotificationStore(
  sortOrder: 'newest' | 'oldest',
  filterType: NotificationType | 'all'
) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);

  // Apply filtering and sorting whenever notifications, filterType, or sortOrder change
  useEffect(() => {
    // Apply filters
    let filtered = notifications;
    
    if (filterType !== 'all') {
      filtered = notifications.filter(notification => notification.type === filterType);
    }
    
    // Sort (no need to re-sort as notifications are already sorted in the main hook)
    setFilteredNotifications(filtered);
  }, [notifications, filterType, sortOrder]);

  return {
    notifications,
    setNotifications,
    filteredNotifications
  };
}
