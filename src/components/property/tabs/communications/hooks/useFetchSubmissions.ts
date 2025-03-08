
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Submission } from "../types";

export function useFetchSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching submissions for property:", propertyId);
      
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching submissions:", error);
        throw error;
      }
      
      console.log("Fetched submissions:", data);
      setSubmissions(data || []);
      
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact submissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, toast]);

  useEffect(() => {
    fetchSubmissions();
    
    // Set up a subscription to listen for changes in the submissions table
    const channel = supabase
      .channel('property_submissions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_contact_submissions',
          filter: `property_id=eq.${propertyId}`
        },
        (payload) => {
          console.log("Real-time update received for property submissions:", payload);
          // When a change is detected, refetch the submissions
          fetchSubmissions();
        }
      )
      .subscribe();

    console.log("Subscription to property_contact_submissions set up for property:", propertyId);
    
    return () => {
      console.log("Cleaning up submission subscription");
      supabase.removeChannel(channel);
    };
  }, [propertyId, fetchSubmissions]);

  return {
    submissions,
    isLoading,
    refreshSubmissions: fetchSubmissions,
    setSubmissions
  };
}
