
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply } from '@/types/submission';

export function useFetchSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Validate propertyId is a proper UUID before using it in a query
  const isValidPropertyId = propertyId && 
                           propertyId.trim() !== '' && 
                           propertyId !== '1' &&
                           /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId);

  const fetchSubmissions = useCallback(async () => {
    // Check if propertyId exists and is valid
    if (!isValidPropertyId) {
      console.log('useFetchSubmissions: No valid propertyId provided, skipping fetch');
      setSubmissions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching submissions for property ID: ${propertyId}`);
      
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          agent:agent_id (
            id,
            email,
            full_name,
            phone,
            avatar_url
          ),
          replies:property_submission_replies(
            id,
            reply_text,
            submission_id,
            user_id,
            created_at,
            updated_at,
            user:user_id(id, full_name, email, avatar_url)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} submissions for property ID: ${propertyId}`);
      
      // Create Submission objects with replies arrays
      const transformedSubmissions: Submission[] = (data || []).map(item => {
        // Transform replies to match SubmissionReply structure
        const transformedReplies: SubmissionReply[] = (item.replies || []).map((reply: any) => ({
          id: reply.id,
          submission_id: reply.submission_id,
          agent_id: reply.user_id,
          message: reply.reply_text,
          text: reply.reply_text, // For compatibility
          created_at: reply.created_at,
          user: reply.user ? {
            id: reply.user.id,
            name: reply.user.full_name,
            email: reply.user.email,
            avatar_url: reply.user.avatar_url
          } : undefined
        }));
        
        return {
          id: item.id,
          property_id: item.property_id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message || '',
          inquiry_type: item.inquiry_type,
          is_read: item.is_read,
          created_at: item.created_at,
          updated_at: item.updated_at,
          agent_id: item.agent_id,
          agent: item.agent ? {
            id: item.agent.id,
            full_name: item.agent.full_name,
            email: item.agent.email,
            phone: item.agent.phone || '',
            avatar_url: item.agent.avatar_url
          } : undefined,
          replies: transformedReplies
        };
      });
      
      setSubmissions(transformedSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, isValidPropertyId]);

  useEffect(() => {
    fetchSubmissions();
    
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('property-submissions-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'property_contact_submissions',
        filter: `property_id=eq.${propertyId}` 
      }, () => {
        // Refetch when submissions change
        fetchSubmissions();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'property_submission_replies' 
      }, () => {
        // Refetch when replies change
        fetchSubmissions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, fetchSubmissions]);

  return {
    submissions,
    isLoading,
    fetchSubmissions,
    refetch: fetchSubmissions
  };
}
