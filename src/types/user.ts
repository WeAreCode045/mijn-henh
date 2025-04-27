
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: "admin" | "agent" | "seller" | "buyer";
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
