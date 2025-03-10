
import { PropertyData } from "@/types/property";

export interface SubmissionReply {
  id: string;
  submission_id: string;
  reply_text: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  user_avatar?: string;
}

export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  inquiry_type?: string;
  replies?: SubmissionReply[];
  // Compatibility fields
  propertyId: string;
  inquiryType: string;
  createdAt: string;
  isRead: boolean;
  property?: PropertyData;
}
