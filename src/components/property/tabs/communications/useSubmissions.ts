
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyData } from "@/types/property";

export interface Reply {
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
  user?: any;
}

export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type?: string;
  created_at: string;
  updated_at: string | null;
  subject: string | null;
  is_read: boolean;
  property?: PropertyData;
  replies: Reply[];
}

export function useSubmissions(propertyId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");

    try {
      let query = supabase
        .from("property_contact_submissions")
        .select(`
          *,
          property:property_id(*),
          replies:property_submission_replies(
            *,
            user:user_id(id, full_name, email, phone, avatar_url)
          )
        `)
        .order("created_at", { ascending: false });

      if (propertyId) {
        query = query.eq("property_id", propertyId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Process the submissions to handle possible null values in user data
      const processedSubmissions = data.map((submission: any) => {
        // Process the replies to handle user data safely
        const processedReplies = submission.replies?.map((reply: any) => {
          // Set user data with safe fallbacks
          const user_name = reply.user?.full_name || 'Unknown User';
          const user_email = reply.user?.email || '';
          const user_phone = reply.user?.phone || '';
          const user_avatar = reply.user?.avatar_url || '';
          
          return {
            ...reply,
            user_name,
            user_email,
            user_phone,
            user_avatar
          };
        }) || [];

        return {
          ...submission,
          replies: processedReplies
        };
      });

      setSubmissions(processedSubmissions);
    } catch (err: any) {
      console.error("Error fetching submissions:", err);
      setError(err.message || "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);

  return {
    submissions,
    loading,
    error,
    fetchSubmissions
  };
}
