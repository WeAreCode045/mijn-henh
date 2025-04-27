
import { User } from "./user";

export interface PropertyMessage {
  id: string;
  property_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  sender?: User;
  recipient?: User;
}

export interface Conversation {
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantAvatar: string | null;
  lastMessage: string;
  lastMessageDate: string | null;
  unreadCount: number;
  propertyId: string;
  propertyTitle: string;
}

export interface MessageData {
  recipientId: string;
  message: string;
}
