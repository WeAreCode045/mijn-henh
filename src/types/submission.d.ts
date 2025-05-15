export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string; // Changed from optional to required
  inquiry_type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string; // Required to match the components/property/tabs/communications/types.ts
  agent_id?: string;
  agent?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
  replies?: SubmissionReply[];
  property?: {  // Added property field to match CommunicationsSection
    id?: string;
    title: string;
  };
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
    avatar_url?: string;
  };
  text?: string; // Added for compatibility
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface SubmissionDetailProps {
  submission: Submission;
  onSendReply: (text: string) => Promise<void>;
  isSending: boolean;
  onMarkAsRead: () => Promise<void>;
  isMarking: boolean;
  onBack?: () => void;
}
