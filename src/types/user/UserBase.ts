
export interface UserBase {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string | undefined;
  whatsapp_number?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  role?: "admin" | "agent" | "seller" | "buyer";
}
