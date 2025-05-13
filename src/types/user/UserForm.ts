
export interface UserFormData {
  email: string;
  password: string;
  display_name?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  whatsapp_number?: string;
  role: "admin" | "agent";
  avatar_url?: string;
  agency_id?: string;
  type: "employee";
  full_name?: string;
}
