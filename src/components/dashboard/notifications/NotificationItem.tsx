
import { Notification } from "./NotificationTypes";
import { NotificationIcon } from "./NotificationIcon";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onToggleRead, onDelete }: NotificationItemProps) {
  return (
    <div 
      key={notification.id}
      className={`p-4 rounded-lg border relative ${notification.read ? 'bg-background' : 'bg-muted/30 border-muted'}`}
      onClick={() => onToggleRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <p className={`${notification.read ? 'font-normal' : 'font-medium'}`}>{notification.title}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the toggleRead
                onDelete(notification.id);
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-muted-foreground">
              {notification.propertyTitle || ''}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(notification.date, "PPp")}
            </p>
          </div>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        )}
      </div>
    </div>
  );
}
