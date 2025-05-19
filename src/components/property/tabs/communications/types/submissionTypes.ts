
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Submission as SubmissionType } from "./index";

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
