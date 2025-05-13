
export interface UserBase {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string | undefined;
  whatsapp_number?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  type?: "employee" | "participant";
  address?: string | undefined;
  city?: string | undefined;
  postal_code?: string | undefined;
  country?: string | undefined;
}
