
export type ParticipantRole = 'buyer' | 'seller';

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
    full_name: string;
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

export interface ParticipantProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  whatsapp_number?: string;
  address?: string;
  city?: string;
  country?: string;
  role?: string;
  avatar_url?: string;
}
