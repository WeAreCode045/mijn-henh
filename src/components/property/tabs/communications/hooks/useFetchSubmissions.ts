
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "../types";

export function useFetchSubmissions(propertyId: string) {
  const {
    data: submissions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["property-contact-submissions", propertyId],
    queryFn: async () => {
      try {
        // Fetch submissions from property_contact_submissions table
        const { data, error } = await supabase
          .from("property_contact_submissions")
          .select(`
            *,
            agent:agent_id (id, email, first_name, last_name, display_name, avatar_url),
            property:property_id (id, title)
          `)
          .eq("property_id", propertyId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // If no submissions were found, return empty array
        if (!data || data.length === 0) {
          return [];
        }

        // Fetch replies for each submission
        const submissionIds = data.map((submission) => submission.id);
        const { data: repliesData, error: repliesError } = await supabase
          .from("property_submission_replies")
          .select("*")
          .in("submission_id", submissionIds);

        if (repliesError) {
          console.error("Error fetching replies:", repliesError);
        }

        // Map replies to submissions
        const repliesMap = new Map();
        if (repliesData && Array.isArray(repliesData)) {
          repliesData.forEach((reply) => {
            if (!repliesMap.has(reply.submission_id)) {
              repliesMap.set(reply.submission_id, []);
            }
            repliesMap.get(reply.submission_id).push(reply);
          });
        }

        // Format submissions with replies
        const formattedSubmissions: Submission[] = data.map((submission) => {
          // Format agent data if present
          let agent = null;
          if (submission.agent && typeof submission.agent === 'object') {
            // Handle possible type error with proper type checking
            const agentData = submission.agent as Record<string, any>;
            agent = {
              id: agentData.id || null,
              email: agentData.email || null,
              first_name: agentData.first_name || null,
              last_name: agentData.last_name || null,
              display_name: agentData.display_name || "Unknown Agent",
              avatar_url: agentData.avatar_url || null,
            };
          }

          // Return formatted submission
          return {
            id: submission.id,
            property_id: submission.property_id,
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            message: submission.message,
            inquiry_type: submission.inquiry_type,
            is_read: submission.is_read,
            created_at: submission.created_at,
            updated_at: submission.updated_at,
            agent_id: submission.agent_id,
            agent,
            property: submission.property,
            replies: repliesMap.get(submission.id) || []
          };
        });

        return formattedSubmissions;
      } catch (err) {
        console.error("Error in useFetchSubmissions:", err);
        throw err;
      }
    },
    enabled: !!propertyId
  });

  return {
    submissions,
    isLoading,
    error,
    refetch // Make sure to include refetch in the return value
  };
}
