
import { UserTimestamps } from './UserTimestamps';

export interface User extends UserTimestamps {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  display_name?: string;
  phone?: string;
  whatsapp_number?: string;
  type?: "employee" | "participant";
  role?: "admin" | "agent" | "buyer" | "seller" | string;
  avatar_url?: string;
}

export * from './UserForm';
export * from './UserTimestamps';
