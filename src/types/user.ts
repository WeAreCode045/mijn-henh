
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: "admin" | "agent" | "seller" | "buyer";
  phone?: string;
  created_at?: string;
  updated_at?: string;
}
