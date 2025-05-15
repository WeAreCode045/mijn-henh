
export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  inquiry_type: string;
  is_read: boolean | null;
  created_at: string;
  updated_at: string;
  agent_id: string | null; // Changed from string to string | null to match the global type
  agent?: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string | null;
  };
  replies?: SubmissionReply[];
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
