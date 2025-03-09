
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
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  property_id: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  agent_id?: string;
  replies?: SubmissionReply[];
  property?: {
    id: string;
    title: string;
  };
}

export interface SubmissionRepliesProps {
  submissionId: string;
  replies: SubmissionReply[];
}

export interface SubmissionDetailProps {
  submission: Submission;
  onCloseDetail: () => void;
  onMarkAsRead: (submissionId: string) => void;
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedSubmissionId: string;
  onSubmissionClick: (submission: Submission) => void;
}

export interface UseMarkAsReadProps {
  handleMarkAsRead: (submissionId: string) => Promise<void>;
}

export interface UseSendResponseProps {
  handleSendResponse: (responseText: string) => Promise<void>;
}
