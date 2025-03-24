
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission } from '../types';

export function useFetchSubmissions(propertyId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Validate propertyId is a proper UUID
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
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} submissions for property ID: ${propertyId}`);
      
      // Create default Submission objects with empty replies arrays
      const transformedSubmissions: Submission[] = (data || []).map(item => ({
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
  }, [propertyId, isValidPropertyId]);

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
