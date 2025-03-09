
export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
  inquiry_type: string;
  property?: {
    title: string;
    address: string;
  };
}

export interface SubmissionReply {
  id: string;
  reply_text: string;
  created_at: string;
  agent_id: string;
  agent: {
    full_name: string;
    email: string;
    agent_photo: string;
  };
}

export interface SubmissionResponse {
  submissionId: string;
  replyText: string;
  agentId: string;
}
