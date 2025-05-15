
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "../types";

export function usePropertySubmissions(propertyId: string) {
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["property-contact-submissions", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_contact_submissions")
        .select(`
          id,
          name,
          email,
          phone,
          message,
          inquiry_type,
          is_read,
          created_at,
          updated_at,
          property_id,
          agent_id,
          agent:accounts (
            id,
            email,
            display_name,
            employer_profiles (
              first_name,
              last_name,
              phone,
              avatar_url
            )
          ),
          property:properties (
            id,
            title
          ),
          replies:property_submission_replies (
            id,
            submission_id,
            agent_id,
            reply_text,
            created_at,
            agent:accounts (
              id,
              email,
              display_name,
              employer_profiles (
                first_name,
                last_name,
                avatar_url
              )
            )
          )
        `)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching property submissions:", error);
        throw error;
      }

      return transformSubmissions(data || []);
    },
    enabled: !!propertyId
  });

  const transformSubmissions = (data: any[]): Submission[] => {
    return data.map((item) => ({
      id: item.id,
      property_id: item.property_id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      message: item.message,
      inquiry_type: item.inquiry_type,
      is_read: item.is_read,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
      agent_id: item.agent_id,
      agent: item.agent ? {
        id: item.agent.id,
        email: item.agent.email,
        full_name: item.agent.display_name || 
          (item.agent.employer_profiles ? 
            `${item.agent.employer_profiles.first_name || ''} ${item.agent.employer_profiles.last_name || ''}`.trim() : 
            ''),
        phone: item.agent.employer_profiles?.phone,
        avatar_url: item.agent.employer_profiles?.avatar_url
      } : undefined,
      property: item.property ? {
        id: item.property.id,
        title: item.property.title
      } : undefined,
      replies: item.replies ? item.replies.map((reply: any) => ({
        id: reply.id,
        submission_id: reply.submission_id,
        agent_id: reply.agent_id,
        message: reply.reply_text,
        created_at: reply.created_at,
        agent: reply.agent ? {
          id: reply.agent.id,
          full_name: reply.agent.display_name || 
            (reply.agent.employer_profiles ? 
              `${reply.agent.employer_profiles.first_name || ''} ${reply.agent.employer_profiles.last_name || ''}`.trim() : 
              ''),
          email: reply.agent.email,
          avatar_url: reply.agent.employer_profiles?.avatar_url
        } : undefined
      })) : []
    }));
  };

  return {
    submissions: submissions || [],
    isLoading,
    error
  };
}
