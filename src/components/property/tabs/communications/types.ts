
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
  property?: any;
  replies: SubmissionReply[];
}

export interface SubmissionRepliesProps {
  submissionId: string;
  replies: SubmissionReply[];
}

export interface SubmissionReplyFormProps {
  onSendResponse: (text: string) => Promise<void>;
  isSending: boolean;
}

export interface SubmissionResponseProps {
  onSendResponse: (text: string) => Promise<void>;
  isSending: boolean;
}

export interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedSubmission: Submission | null;
  onSubmissionClick: (submission: Submission) => void;
}

export interface UseMarkAsReadProps {
  handleMarkAsRead: (submissionId: string) => Promise<void>;
}

export interface UseSendResponseProps {
  handleSendResponse: (responseText: string) => Promise<void>;
}
