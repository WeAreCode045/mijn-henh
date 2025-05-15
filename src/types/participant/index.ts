
export interface ParticipantProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
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
  } | null;
  nationality?: string | null;
  gender?: string | null;
  iban?: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  properties: any[];
  avatar_url: string | null;
  bank_account_number?: string | null;
}

export interface ParticipantForm {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}
