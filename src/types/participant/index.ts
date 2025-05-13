
export type ParticipantRole = 'buyer' | 'seller';
export type ParticipantStatus = 'active' | 'pending' | 'inactive';

export interface ParticipantProfileData {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  date_of_birth?: Date | null;
  place_of_birth?: string | null;
  identification?: {
    type?: "passport" | "IDcard" | null;
    social_number?: string | null;
    document_number?: string | null;
  } | null;
  nationality?: string | null;
  gender?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
  iban?: string | null;
  created_at?: string;
  updated_at?: string;
  role?: ParticipantRole;
  properties?: string[];
  avatar_url?: string | null;
  full_name?: string;
}

export interface PropertyParticipant {
  id: string;
  user_id: string;
  property_id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  email?: string | null;
  documents_signed?: string[] | null;
  webview_approved?: boolean;
  created_at?: string;
  updated_at?: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  participant_profile: ParticipantProfileData | null;
}

export interface ParticipantInvite {
  email: string;
  firstName: string;
  lastName: string;
  role: ParticipantRole;
  propertyId: string;
}
