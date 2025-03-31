
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown, Bell } from "lucide-react";
import { NotificationIcon } from "./notifications/NotificationIcon";
import { Notification } from "./notifications/NotificationTypes";
import { useNotifications } from "./notifications/useNotifications";
import { format } from "date-fns";

export function CompactNotificationsBar() {
  const [startIndex, setStartIndex] = useState(0);
  const { notifications } = useNotifications();
  
  // Reset start index when notifications change
  useEffect(() => {
    setStartIndex(0);
  }, [notifications.length]);
  
  // Delete a notification
  const handleDeleteNotification = (id: string) => {
    // This will be handled by the useNotifications hook now
  };

  const handlePrevious = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(notifications.length - 1, prev + 1));
  };

  // Get the current notification to display (just 1)
  const currentNotification = notifications[startIndex];
  
  // Calculate if navigation buttons should be enabled
  const canGoUp = startIndex > 0;
  const canGoDown = startIndex < notifications.length - 1;

  return (
    <Card className="h-full bg-primary text-white">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-white">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
          <span className="text-xs bg-white text-primary rounded-full px-2 py-0.5">
            {notifications.length}
          </span>
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={handlePrevious}
            disabled={!canGoUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={handleNext}
            disabled={!canGoDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {!currentNotification ? (
          <div className="text-center text-white/70 p-4">
            No notifications
          </div>
        ) : (
          <div 
            key={currentNotification.id} 
            className="p-3 bg-white/10 rounded-md relative border border-white/20"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 absolute top-1 right-1 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => handleDeleteNotification(currentNotification.id)}
            >
              <X className="h-3 w-3" />
            </Button>
            
            <div className="flex items-start mb-1">
              <div className="mr-2 text-white">
                <NotificationIcon type={currentNotification.type} />
              </div>
              <span className="font-medium">{currentNotification.title}</span>
            </div>
            <p className="text-sm text-white/70">{currentNotification.message}</p>
            <p className="text-xs text-white/50 mt-1">
              {format(currentNotification.date, "PPp")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
