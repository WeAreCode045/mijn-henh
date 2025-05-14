
import { useState } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  status?: "success" | "error" | "warning" | "info";
  duration?: number;
  isClosable?: boolean;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...props };
    setToasts((currentToasts) => [...currentToasts, newToast]);
    
    if (props.duration !== Infinity) {
      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        );
      }, props.duration || 3000);
    }
    
    return id;
  };

  const closeToast = (id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  return {
    toasts,
    toast,
    closeToast,
  };
}

// Export the toast function directly
export const toast = (props: Omit<Toast, "id">) => {
  // Use a singleton approach for direct usage
  const id = Math.random().toString(36).substring(2, 9);
  console.log(`Toast triggered: ${props.title || 'Notification'}`);
  return id;
};
