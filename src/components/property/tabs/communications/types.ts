export interface SubmissionAgent {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string; // Changed from agent_photo to avatar_url
}

export interface SubmissionProperty {
  id: string;
  title: string;
}

export interface SubmissionReply {
  id: string;
  submission_id: string;
  message: string;
  created_at: string;
  agent: SubmissionAgent | null;
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
  is_read: boolean;
  agent_id?: string;
  property?: SubmissionProperty;
  replies?: SubmissionReply[];
}

export interface UseSubmissionActionsProps {
  propertyId: string;
  refetchSubmissions: () => void;
}

export interface SubmissionResponse {
  id: string;
  success: boolean;
  message: string;
}

export interface SubmissionResponseProps {
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export interface SubmissionItemProps {
  submission: Submission;
  isSelected: boolean;
  onClick: () => void;
  onMarkAsRead: (id: string) => void;
}

export interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedSubmission: Submission | null;
  onSubmissionClick: (submission: Submission) => void;
  onMarkAsRead: (id: string) => void;
}

export interface SubmissionDetailProps {
  submission: Submission | null;
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
  onMarkAsRead: (id: string) => Promise<void>;
}
