
export interface UserFormData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  whatsapp_number?: string;
  role: "admin" | "agent";
  avatar_url?: string;
}
