
import { ParticipantRole } from "@/types/participant";
import { ParticipantIdentification } from "@/types/participant/ParticipantIdentification";

export interface ParticipantFormData {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  whatsapp_number?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  nationality?: string;
  gender?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  role: ParticipantRole;
  iban?: string;
  identification?: ParticipantIdentification;
}

export interface ParticipantUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  whatsapp_number?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  nationality?: string;
  gender?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  role?: ParticipantRole;
  iban?: string;
  identification?: ParticipantIdentification;
}
