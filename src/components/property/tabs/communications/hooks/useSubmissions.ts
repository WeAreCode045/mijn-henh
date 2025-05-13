import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  agent: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    avatar_url: string;
  };
  property: {
    id: string;
    title: string;
  };
  replies: any[];
}

export function useSubmissions(propertyId: string) {
  const queryClient = useQueryClient();

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["submissions", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          id,
          name,
          email,
          phone,
          inquiry_type,
          message,
          created_at,
          is_read,
          agent: agents (
            id,
            email,
            first_name,
            last_name,
            display_name,
            avatar_url
          ),
          property: properties (
            id,
            title
          ),
          replies (
            id,
            created_at,
            message,
            agent_id
          )
        `)
        .eq("property_id", propertyId);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      return transformData(data);
    },
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
        agent: {
          id: item.agent?.id || '',
          email: item.agent?.email || '',
          first_name: item.agent?.first_name || '',
          last_name: item.agent?.last_name || '',
          display_name: item.agent?.display_name || item.agent?.first_name ? `${item.agent?.first_name} ${item.agent?.last_name || ''}` : '',
          avatar_url: item.agent?.avatar_url || '',
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

  const markAsReadMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await supabase
        .from("submissions")
        .update({ is_read: true })
        .eq("id", submissionId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["submissions", propertyId]);
    },
  });

  return {
    submissions,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
  };
}
