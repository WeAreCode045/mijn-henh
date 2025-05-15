
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "../types";

export const useFetchSubmissions = (propertyId: string) => {
  const {
    data: submissions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["property-submissions", propertyId],
    queryFn: async () => {
      if (!propertyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("property_contact_submissions")
        .select(`
          id,
          name,
          email,
          phone,
          inquiry_type,
          message,
          created_at,
          is_read,
          agent_id,
          agent:accounts(
            id,
            email,
            employer_profiles(
              first_name,
              last_name,
              avatar_url
            ),
            display_name
          ),
          property:properties(
            id,
            title
          ),
          replies:property_submission_replies(
            id,
            created_at,
            reply_text,
            agent:accounts(
              id,
              email,
              employer_profiles(
                first_name,
                last_name,
                avatar_url
              ),
              display_name
            )
          )
        `)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching property submissions:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!propertyId,
  });

  const transformData = (data: any[]) => {
    return data.map((item) => {
      const transformedItem = {
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        inquiry_type: item.inquiry_type,
        message: item.message,
        created_at: item.created_at,
        is_read: item.is_read,
        property_id: item.property_id,
        updated_at: item.updated_at || item.created_at, // Fallback for updated_at
        agent_id: item.agent_id,
        agent: {
          id: item.agent?.id || '',
          email: item.agent?.email || '',
          first_name: item.agent?.employer_profiles?.first_name || '',
          last_name: item.agent?.employer_profiles?.last_name || '',
          display_name: item.agent?.display_name || item.agent?.employer_profiles?.first_name ? `${item.agent?.employer_profiles?.first_name} ${item.agent?.employer_profiles?.last_name || ''}` : '',
          avatar_url: item.agent?.employer_profiles?.avatar_url || '',
        },
        property: {
          id: item.property?.id || '',
          title: item.property?.title || '',
        },
        replies: item.replies?.map((reply: any) => ({
          id: reply.id,
          submission_id: reply.submission_id || item.id,
          message: reply.reply_text,
          created_at: reply.created_at,
          agent_id: reply.agent_id,
          agent: {
            id: reply.agent?.id || '',
            full_name: reply.agent?.display_name || (reply.agent?.employer_profiles ? `${reply.agent.employer_profiles.first_name || ''} ${reply.agent.employer_profiles.last_name || ''}` : ''),
            email: reply.agent?.email || '',
            avatar_url: reply.agent?.employer_profiles?.avatar_url || '',
          }
        })) || [],
      };

      return transformedItem;
    });
  };

  const submissionsData = submissions ? transformData(submissions) : [];

  return {
    submissions: submissionsData,
    isLoading,
    error,
    refetch,
  };
};
