
export interface Submission {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  agentId: string | null;
  agent?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
  } | null;
  replies: SubmissionReply[];
}

export interface SubmissionReply {
  id: string;
  submissionId: string;
  replyText: string;
  createdAt: string;
  updatedAt: string;
  agentId: string | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userAvatar: string | null;
}
