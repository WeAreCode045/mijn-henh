
import { Bell, Calendar, CheckSquare, MessageSquare, Users, Edit } from "lucide-react";
import { NotificationType } from "./NotificationTypes";

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
}

export function NotificationIcon({ type, className }: NotificationIconProps) {
  // Default classes for each type - will be overridden by className if provided
  const getDefaultClass = () => {
    switch (type) {
      case 'assignment':
        return "text-blue-500";
      case 'change':
        return "text-amber-500";
      case 'agenda':
        return "text-green-500";
      case 'todo':
        return "text-purple-500";
      case 'communication':
        return "text-pink-500";
      default:
        return "text-gray-500";
    }
  };
  
  const iconClass = `h-5 w-5 ${className || getDefaultClass()}`;
  
  switch (type) {
    case 'assignment':
      return <Users className={iconClass} />;
    case 'change':
      return <Edit className={iconClass} />;
    case 'agenda':
      return <Calendar className={iconClass} />;
    case 'todo':
      return <CheckSquare className={iconClass} />;
    case 'communication':
      return <MessageSquare className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
}
