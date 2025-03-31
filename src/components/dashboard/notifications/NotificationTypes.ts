
import { ReactNode } from "react";

// Define notification type
export type NotificationType = 'agenda' | 'todo' | 'communication' | 'system' | 'assignment' | 'change';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  propertyId?: string;
  propertyTitle?: string;
}
