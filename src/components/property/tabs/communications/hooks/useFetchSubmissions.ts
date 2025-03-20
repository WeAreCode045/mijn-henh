
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission } from '../types';

export function useFetchSubmissions(propertyId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
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
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Create default Submission objects with empty replies arrays
      const transformedSubmissions: Submission[] = (data || []).map(item => ({
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
          phone: item.agent.phone || '',
          avatar_url: item.agent.avatar_url
        } : undefined,
        replies: []
      }));
      
      setSubmissions(transformedSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId, fetchSubmissions]);

  return {
    submissions,
    isLoading,
    fetchSubmissions,
    refetch: fetchSubmissions
  };
}
