
import { User } from "./user";

export type ParticipantRole = 'seller' | 'buyer';
export type ParticipantStatus = 'pending' | 'active' | 'declined';

export interface ParticipantProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  date_of_birth: string | null;
  id_number: string | null;
  social_number: string | null;
  place_of_birth: string | null;
  nationality: string | null;
  gender: string | null;
  bank_account_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

export interface PropertyParticipant {
  id: string;
  property_id: string;
  user_id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  created_at: string;
  updated_at: string;
  documents_signed: string[] | null;
  webview_approved: boolean;
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
  participant_profile?: ParticipantProfileData;
}

export interface ParticipantInvite {
  email: string;
  role: ParticipantRole;
  propertyId: string;
}
