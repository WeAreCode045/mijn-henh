
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission } from '@/types/submission';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Validate propertyId is a proper UUID before using it in a query
  const isValidPropertyId = propertyId && 
                           propertyId.trim() !== '' && 
                           propertyId !== '1' &&
                           /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId);

  const fetchSubmissions = useCallback(async () => {
    // Check if propertyId exists and is valid
    if (!isValidPropertyId) {
      console.log('useSubmissions: No valid propertyId provided, skipping fetch');
      setSubmissions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Fetching submissions for property ID: ${propertyId}`);
      
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          agent:agent_id(
            id,
            first_name, 
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} submissions for property ID: ${propertyId}`);

      // Transform data to match Submission interface
      const transformedData = data.map(item => {
        // Safely handle agent data which might be null or an error
        let agentData = undefined;
        if (item.agent && typeof item.agent === 'object' && !('error' in item.agent)) {
          const firstName = item.agent.first_name || '';
          const lastName = item.agent.last_name || '';
          agentData = {
            id: item.agent.id,
            full_name: `${firstName} ${lastName}`.trim() || 'Unnamed Agent',
            email: item.agent.email || '',
            phone: item.agent.phone || '',
            avatar_url: item.agent.avatar_url
          };
        }

        return {
          id: item.id,
          property_id: item.property_id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message,
          inquiry_type: item.inquiry_type,
          is_read: item.is_read,
          created_at: item.created_at,
          updated_at: item.updated_at,
          agent_id: item.agent_id,
          agent: agentData,
          replies: []
        };
      });

      setSubmissions(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching submissions'));
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, isValidPropertyId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const refetch = fetchSubmissions;

  return {
    submissions,
    isLoading,
    error,
    refetch
  };
}
