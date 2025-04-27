
export interface UserBase {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  whatsapp_number?: string;
  created_at?: string;
  role?: "admin" | "agent" | "seller" | "buyer";
}
