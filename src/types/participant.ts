
import { User } from "./user";

export type ParticipantRole = 'seller' | 'buyer';
export type ParticipantStatus = 'pending' | 'active' | 'declined';

export interface PropertyParticipant {
  id: string;
  property_id: string;
  user_id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  created_at: string;
  updated_at: string;
  user?: User; // Joined from profiles
}

export interface ParticipantInvite {
  email: string;
  role: ParticipantRole;
  propertyId: string;
}
