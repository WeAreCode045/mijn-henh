
export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  agent_id: string | null;
  agent?: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string | null;
  };
  replies?: any[];
}

export interface SubmissionReply {
  id: string;
  submission_id: string;
  agent_id: string;
  message: string;
  created_at: string;
  agent?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}
