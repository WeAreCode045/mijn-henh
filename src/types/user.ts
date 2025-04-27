
export interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  role: "admin" | "agent" | "seller" | "buyer" | null;
  avatar_url: string | null; 
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface UserFormData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  whatsapp_number: string;
  role: "admin" | "agent" | "seller" | "buyer";
  avatar_url: string; 
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}
