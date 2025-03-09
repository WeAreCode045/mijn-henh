
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission } from '../types';

export function useFetchSubmissions(propertyId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Create default Submission objects with empty replies arrays
      const transformedSubmissions: Submission[] = data.map(item => ({
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
        replies: [] // Initialize with empty array
      }));
      
      setSubmissions(transformedSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);

  return {
    submissions,
    isLoading,
    fetchSubmissions
  };
}
