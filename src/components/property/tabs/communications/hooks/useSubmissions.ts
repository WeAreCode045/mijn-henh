
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
    queryKey: ["property-contact-submissions", propertyId],
    queryFn: async () => {
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
          property_id
        `)
        .eq("property_id", propertyId);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }
      
      // Fetch agents for these submissions
      const agentIds = data.filter(item => item.agent_id).map(item => item.agent_id);
      let agentsData: any[] = [];
      
      if (agentIds.length > 0) {
        const { data: agents } = await supabase
          .from('employer_profiles')
          .select('*')
          .in('id', agentIds);
          
        agentsData = agents || [];
      }
      
      // Fetch properties for these submissions
      const propertyIds = data.map(item => item.property_id).filter(Boolean);
      let propertiesData: any[] = [];
      
      if (propertyIds.length > 0) {
        const { data: properties } = await supabase
          .from('properties')
          .select('id, title')
          .in('id', propertyIds);
          
        propertiesData = properties || [];
      }
      
      // Fetch replies for these submissions
      const submissionIds = data.map(item => item.id);
      let repliesData: any[] = [];
      
      if (submissionIds.length > 0) {
        const { data: replies } = await supabase
          .from('property_submission_replies')
          .select('*')
          .in('submission_id', submissionIds);
          
        repliesData = replies || [];
      }
      
      // Create maps for quick lookups
      const agentsMap = new Map();
      agentsData.forEach(agent => {
        agentsMap.set(agent.id, agent);
      });
      
      const propertiesMap = new Map();
      propertiesData.forEach(property => {
        propertiesMap.set(property.id, property);
      });
      
      // Group replies by submission_id
      const repliesMap = new Map();
      repliesData.forEach(reply => {
        if (!repliesMap.has(reply.submission_id)) {
          repliesMap.set(reply.submission_id, []);
        }
        repliesMap.get(reply.submission_id).push(reply);
      });

      return data.map((item) => {
        const agent = agentsMap.get(item.agent_id) || {};
        const property = propertiesMap.get(item.property_id) || {};
        const replies = repliesMap.get(item.id) || [];
        
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          inquiry_type: item.inquiry_type,
          message: item.message,
          created_at: item.created_at,
          is_read: item.is_read,
          agent: {
            id: agent.id || '',
            email: agent.email || '',
            first_name: agent.first_name || '',
            last_name: agent.last_name || '',
            display_name: agent.display_name || agent.first_name ? `${agent.first_name} ${agent.last_name || ''}` : '',
            avatar_url: agent.avatar_url || '',
          },
          property: {
            id: property.id || '',
            title: property.title || '',
          },
          replies: replies || [],
        };
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await supabase
        .from("property_contact_submissions")
        .update({ is_read: true })
        .eq("id", submissionId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-contact-submissions", propertyId]
      });
    },
  });

  return {
    submissions,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
  };
}
