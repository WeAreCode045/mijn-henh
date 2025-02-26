
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  role: "admin" | "agent" | null;
  agent_photo: string | null;
}

export interface UserFormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  whatsappNumber: string;
  role: "admin" | "agent";
}
