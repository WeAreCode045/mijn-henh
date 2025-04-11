
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatusSelector } from "../../../../dashboard/components/StatusSelector";
import { useToast } from "@/hooks/use-toast";

interface StatusSectionProps {
  propertyId: string;
  isArchived?: boolean;
}

export function StatusSection({ propertyId, isArchived = false }: StatusSectionProps) {
  const [status, setStatus] = useState<string>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (propertyId) {
      fetchPropertyStatus();
    }
  }, [propertyId]);

  const fetchPropertyStatus = async () => {
    if (!propertyId) return;
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('status')
        .eq('id', propertyId)
        .single();
        
      if (error) throw error;
      
      if (data && data.status) {
        setStatus(data.status.toLowerCase());
      }
    } catch (error) {
      console.error("Error fetching property status:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!propertyId) return Promise.reject("Property ID is missing");
    
    setIsLoading(true);
    try {
      console.log("Updating property status to:", newStatus);
      
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);
        
      if (error) {
        console.error("Error from Supabase:", error);
        throw error;
      }
      
      setStatus(newStatus);
      toast({
        description: `Status updated to ${newStatus}`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StatusSelector 
      propertyId={propertyId}
      initialStatus={status}
      onStatusChange={handleStatusChange}
    />
  );
}
