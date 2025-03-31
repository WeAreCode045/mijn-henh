
import { Notification, NotificationType } from "./NotificationTypes";
import { NotificationItem } from "./NotificationItem";

interface NotificationsListProps {
  notifications: Notification[];
  filterType: NotificationType | 'all';
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationsList({ 
  notifications, 
  filterType, 
  onToggleRead, 
  onDelete 
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No notifications available</p>
        {filterType !== 'all' && (
          <p className="text-sm text-muted-foreground mt-1">
            Try changing your filter
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onToggleRead={onToggleRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
