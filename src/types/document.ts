
export type DocumentType = 'contract' | 'identification' | 'financial' | 'property' | 'other';
export type SignatureStatus = 'pending' | 'signed' | 'declined';

export interface Document {
  id: string;
  property_id?: string;
  creator_id: string;
  title: string;
  description?: string;
  file_url: string;
  document_type: DocumentType;
  is_global: boolean;
  requires_signature: boolean;
  created_at: string;
  updated_at: string;
  signatures?: DocumentSignature[];
  creator?: {
    id: string;
    full_name?: string;
    email?: string;
  };
}

export interface DocumentSignature {
  id: string;
  document_id: string;
  user_id: string;
  status: SignatureStatus;
  signature_data?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name?: string;
    email?: string;
  };
}
