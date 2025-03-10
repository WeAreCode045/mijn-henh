
export interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  role: "admin" | "agent" | null;
  avatar: string | null; // Using avatar instead of agent_photo
}

export interface UserFormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  whatsappNumber: string;
  role: "admin" | "agent";
}
