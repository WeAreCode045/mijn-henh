
export interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  role: "admin" | "agent" | null;
  avatar_url: string | null; // Changed from avatar to avatar_url to match database
}

export interface UserFormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  whatsappNumber: string;
  role: "admin" | "agent";
}
