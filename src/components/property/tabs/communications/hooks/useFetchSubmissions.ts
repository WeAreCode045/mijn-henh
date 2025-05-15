
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
          agent_id,
          property_id,
          updated_at
        `
        )
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching property submissions:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!propertyId, // Only run the query if propertyId is not null
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
        updated_at: item.updated_at || item.created_at,
        is_read: item.is_read,
        agent_id: item.agent_id,
        property_id: item.property_id,
        agent: {
          id: '',
          email: '',
          first_name: '',
          last_name: '',
          display_name: '',
          avatar_url: '',
        },
        property: {
          id: item.property_id || '',
          title: '',
        },
        replies: [],
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
