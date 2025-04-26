
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
  };
  recipient?: {
    id: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
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
