
import { Notification } from "./NotificationTypes";
import { NotificationItem } from "./NotificationItem";

interface NotificationsListProps {
  notifications: Notification[];
  filterType: string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationsList({ 
  notifications, 
  filterType, 
  onMarkAsRead, 
  onDelete 
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {filterType !== 'all' 
          ? `No ${filterType} notifications to display` 
          : 'No notifications to display'}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
