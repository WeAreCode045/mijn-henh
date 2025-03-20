
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission } from '@/types/submission';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          agent:profiles(*)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Submission interface
      const transformedData = data.map(item => ({
        id: item.id,
        property_id: item.property_id || propertyId, // Ensure property_id is set
        name: item.name,
        email: item.email,
        phone: item.phone,
        message: item.message,
        inquiry_type: item.inquiry_type,
        is_read: item.is_read,
        created_at: item.created_at,
        updated_at: item.updated_at,
        agent_id: item.agent_id,
        agent: item.agent ? {
          id: item.agent.id,
          full_name: item.agent.full_name,
          email: item.agent.email,
          phone: item.agent.phone,
          avatar_url: item.agent.avatar_url
        } : undefined,
        replies: []
      }));

      setSubmissions(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching submissions'));
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

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
