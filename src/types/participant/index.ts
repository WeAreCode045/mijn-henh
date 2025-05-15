
export interface ParticipantProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  whatsapp_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string | null;
  place_of_birth?: string | null;
  identification?: {
    type?: string | null;
    document_number?: string | null;
    social_number?: string | null;
  };
  nationality?: string | null;
  gender?: string | null;
  iban?: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
  properties?: any[];
  full_name?: string;
  bank_account_number?: string | null;
  avatar_url?: string | null;
}

export type ParticipantRole = 'seller' | 'buyer';

export interface PropertyParticipant {
  id: string;
  property_id: string;
  user_id: string;
  role: ParticipantRole;
  status: string;
  created_at: string;
  updated_at: string;
  documents_signed?: string[];
  webview_approved?: boolean;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface ParticipantRemoveParams {
  participantId: string;
  role: ParticipantRole;
}

export interface ParticipantStatusUpdateParams {
  participantId: string;
  status: string;
}
