
export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  agent_id?: string;
}
