
export interface PropertyAgent {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  name?: string; // Adding for compatibility
  photoUrl?: string; // For compatibility with PropertyAgent in property.d.ts
  avatar_url?: string;
  address?: string; // For compatibility with PropertyAgent in property.d.ts
}
