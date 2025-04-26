
import { User } from "./user";

export type ParticipantRole = 'seller' | 'buyer';
export type ParticipantStatus = 'pending' | 'active' | 'declined';

export interface PropertyParticipant {
  id: string;
  property_id: string;
  user_id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp_number?: string | null;
    avatar_url?: string | null;
    address?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  };
}

export interface ParticipantInvite {
  email: string;
  role: ParticipantRole;
  propertyId: string;
}
