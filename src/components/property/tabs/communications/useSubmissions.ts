import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Submission {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  createdAt: string;
  isRead: boolean;
  replies: Reply[];
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
  } | null;
  property_id: string;
  inquiry_type: string;
  created_at: string;
  is_read: boolean;
}

export interface Reply {
  id: string;
  text: string;
  createdAt: string;
  agent: {
    id: string;
    name: string;
    email: string;
    photoUrl: string;
  } | null;
}

interface UseSubmissionsProps {
  propertyId: string;
}

export function useSubmissions({ propertyId }: UseSubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("property_contact_submissions")
        .select(
          `
          id,
          property_id,
          name,
          email,
          phone,
          message,
          inquiry_type,
          created_at,
          is_read,
          replies: property_contact_submission_replies (
            id,
            text,
            created_at,
            user: profiles (
              id,
              full_name,
              email,
              avatar_url
            )
          )
        `
        )
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const transformedSubmissions = data.map((submission) => {
          return {
            id: submission.id,
            propertyId: submission.property_id,
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            message: submission.message,
            inquiryType: submission.inquiry_type,
            createdAt: submission.created_at,
            isRead: submission.is_read,
            replies: transformSubmissionReplies(
              submission.replies as any[] | null
            ),
            property_id: submission.property_id,
            inquiry_type: submission.inquiry_type,
            created_at: submission.created_at,
            is_read: submission.is_read,
          };
        });
        setSubmissions(transformedSubmissions as Submission[]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submissions, loading, error, fetchSubmissions };
}

function transformSubmissionReplies(replies: any[] | null): Reply[] {
  if (!replies) {
    return [];
  }

  return replies.map((reply) => {
    const transformedReply = {
      id: reply.id,
      text: reply.text,
      createdAt: reply.created_at,
      agent: reply.user ? {
        id: reply.user?.id ?? '',
        name: reply.user?.full_name ?? 'Unknown',
        email: reply.user?.email ?? '',
        photoUrl: reply.user?.avatar_url ?? ''
      } : null
    };
    return transformedReply;
  });
}
