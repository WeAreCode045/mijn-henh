
export interface ParticipantProfileData {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  date_of_birth?: string | null;
  place_of_birth?: string | null;
  identification?: any | null;
  nationality?: string | null;
  gender?: string | null;
  iban?: string | null;
  role?: string | null;
  bank_account_number?: string | null;
  full_name?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  properties?: any[];
}
