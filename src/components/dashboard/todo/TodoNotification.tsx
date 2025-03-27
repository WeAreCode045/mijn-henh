
import { useEffect } from "react";
import { TodoItem } from "@/hooks/todo/types";

interface TodoNotificationProps {
  todoItems: TodoItem[];
  updateTodoItem: (id: string, data: Partial<Omit<TodoItem, "id" | "created_at" | "updated_at">>) => Promise<void>;
}

export function TodoNotification({ todoItems, updateTodoItem }: TodoNotificationProps) {
  useEffect(() => {
    // Request notification permission if not yet granted
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    // Set up notification check interval
    const checkNotifications = () => {
      todoItems.forEach(item => {
        if (
          item.notify_at &&
          !item.notification_sent &&
          !item.completed &&
          new Date(item.notify_at) <= new Date()
        ) {
          // Send notification
          if (Notification.permission === "granted") {
            const notification = new Notification("Task Reminder", {
              body: item.title,
              icon: "/favicon.ico"
            });
            
            // Mark notification as sent
            updateTodoItem(item.id, { notification_sent: true });
            
            // Close notification after 10 seconds
            setTimeout(() => notification.close(), 10000);
          }
        }
      });
    };
    
    // Check every minute
    const interval = setInterval(checkNotifications, 60000);
    
    // Initial check
    checkNotifications();
    
    return () => clearInterval(interval);
  }, [todoItems, updateTodoItem]);

  return null; // This component doesn't render anything
}
