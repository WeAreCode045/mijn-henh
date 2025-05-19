
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  agent_id: string | null;
  agent?: {
    id: string;
    fullName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string | null;
    first_name?: string;
    last_name?: string;
    display_name?: string;
  } | null;
  property?: any;
  replies: SubmissionReply[];
}

export interface SubmissionReply {
  id: string;
  submission_id: string;
  reply_text: string;
  created_at: string;
  updated_at: string;
  agent_id: string | null;
  user_id: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userPhone?: string | null;
  userAvatar?: string | null;
}

export function useSubmissions(propertyId: string) {
  return useQuery({
    queryKey: ["property-submissions", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_contact_submissions")
        .select("*")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId
  });
}
