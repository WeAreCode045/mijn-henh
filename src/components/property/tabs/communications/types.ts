
export interface SubmissionAgent {
  id: string;
  full_name?: string;
  email?: string;
  agent_photo?: string;
}

export interface SubmissionReply {
  id: string;
  submission_id: string;
  reply_text: string;
  created_at: string;
  agent?: SubmissionAgent;
}

export interface SubmissionProperty {
  id: string;
  title: string;
  address?: string;
}

export interface Submission {
  id: string;
  property_id: string;
  agent_id?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  inquiry_type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  property?: SubmissionProperty;
  replies?: SubmissionReply[];
}
