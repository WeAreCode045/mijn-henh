
export type ParticipantRole = "buyer" | "seller" | "broker" | "agent" | "notary";

export interface ParticipantUser {
  id: string;
  email: string;
  full_name: string;
}

export interface PropertyParticipant {
  id: string;
  property_id: string;
  user_id: string;
  role: ParticipantRole;
  status: string;
  created_at: string;
  updated_at: string;
  webview_approved: boolean | null;
  documents_signed: string[];
  user: ParticipantUser;
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
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  date_of_birth: string | null;
  place_of_birth: string | null;
  nationality: string | null;
  gender: string | null;
  iban: string | null;
  role: ParticipantRole;
  created_at: string;
  updated_at: string;
  properties: any[];
  avatar_url: string | null;
  full_name: string;
  bank_account_number: string | null;
  identification: {
    type: string | null;
    document_number: string | null;
    social_number: string | null;
  };
}
