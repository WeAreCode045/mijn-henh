
import { User } from "./user";

export interface PropertyMessage {
  id: string;
  property_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
    phone?: string;
    whatsapp_number?: string;
    created_at?: string;
    updated_at?: string;
  };
  recipient?: {
    id: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
    phone?: string;
    whatsapp_number?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  propertyId: string;
  propertyTitle: string;
}

export interface MessageData {
  recipientId: string;
  message: string;
}
