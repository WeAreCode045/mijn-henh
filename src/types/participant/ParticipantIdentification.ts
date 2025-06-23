
export interface ParticipantIdentification {
  type?: "passport" | "IDcard" | null;
  social_number?: string | null;
  document_number?: string | null;
}
