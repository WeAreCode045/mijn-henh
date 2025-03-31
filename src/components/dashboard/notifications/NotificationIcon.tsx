
import { Bell, Calendar, CheckSquare, MessageSquare, Users, Edit } from "lucide-react";
import { NotificationType } from "./NotificationTypes";

interface NotificationIconProps {
  type: NotificationType;
}

export function NotificationIcon({ type }: NotificationIconProps) {
  switch (type) {
    case 'assignment':
      return <Users className="h-5 w-5 text-blue-500" />;
    case 'change':
      return <Edit className="h-5 w-5 text-amber-500" />;
    case 'agenda':
      return <Calendar className="h-5 w-5 text-green-500" />;
    case 'todo':
      return <CheckSquare className="h-5 w-5 text-purple-500" />;
    case 'communication':
      return <MessageSquare className="h-5 w-5 text-pink-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}
