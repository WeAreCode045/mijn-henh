export interface User {
  id: string;
  email: string;
  full_name: string;
  role?: "admin" | "agent" | "seller" | "buyer";
  avatar_url?: string | null;
  phone?: string;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  whatsapp_number?: string;
  role: "admin" | "agent";
  avatar_url?: string;
}
