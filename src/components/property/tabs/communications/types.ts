
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
  agent_id: string | null;
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
  user_name?: string;       // Adding this to match component usage
  user_avatar?: string;     // Adding this to match component usage
  reply_text?: string;      // Adding this to match component usage
  agent?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}
