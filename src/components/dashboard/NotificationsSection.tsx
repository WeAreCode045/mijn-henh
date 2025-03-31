
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import { FilterControls } from "./notifications/FilterControls";
import { NotificationsList } from "./notifications/NotificationsList";
import { useNotifications } from "./notifications/useNotifications";

// Re-export the Notification type
export { type NotificationType, type Notification } from "./notifications/NotificationTypes";

export function NotificationsSection() {
  const { 
    notifications, 
    filterType, 
    setFilterType, 
    sortOrder, 
    setSortOrder, 
    toggleReadStatus, 
    deleteNotification,
    getTypeCount
  } = useNotifications();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> All Notifications
          </CardTitle>
          <FilterControls 
            filterType={filterType} 
            setFilterType={setFilterType} 
            sortOrder={sortOrder} 
            setSortOrder={setSortOrder} 
            getTypeCount={getTypeCount}
          />
        </div>
        <CardDescription>
          Stay updated with property changes and assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationsList 
          notifications={notifications}
          filterType={filterType}
          onToggleRead={toggleReadStatus}
          onDelete={deleteNotification}
        />
      </CardContent>
    </Card>
  );
}
