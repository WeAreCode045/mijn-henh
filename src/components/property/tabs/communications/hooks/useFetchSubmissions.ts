import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFetchSubmissions = (propertyId: string) => {
  const {
    data: submissions,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["property-submissions", propertyId],
    async () => {
      if (!propertyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("property_inquiries")
        .select(
          `
          id,
          name,
          email,
          phone,
          inquiry_type,
          message,
          created_at,
          is_read,
          agent:accounts (
            id,
            email,
            employer_profiles (
              first_name,
              last_name,
              avatar_url
            ),
            display_name
          ),
          property:properties (
            id,
            title
          ),
          replies (
            id,
            created_at,
            message,
            agent:accounts (
              id,
              email,
              employer_profiles (
                first_name,
                last_name,
                avatar_url
              ),
              display_name
            )
          )
        `
        )
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching property submissions:", error);
        throw error;
      }

      return data;
    },
    {
      enabled: !!propertyId, // Only run the query if propertyId is not null
    }
  );

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
        replies: item.replies || [],
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
