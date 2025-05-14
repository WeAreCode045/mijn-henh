
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
  agent_id?: string;
  agent?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    avatar_url: string;
  };
  property?: {
    id: string;
    title: string;
  };
  replies?: SubmissionReply[];
}

export interface SubmissionReply {
  id: string;
  submission_id: string;
  message: string;
  reply_text?: string;
  created_at: string;
  agent?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    avatar_url: string;
  };
}
