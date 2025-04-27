
export interface UserBase {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: "admin" | "agent" | "seller" | "buyer";
}
