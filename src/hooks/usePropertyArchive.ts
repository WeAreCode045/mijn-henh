
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";
import { useNavigate } from "react-router-dom";

export function usePropertyArchive() {
  const [isArchiving, setIsArchiving] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();
  const navigate = useNavigate();

  const archiveProperty = async (propertyId: string): Promise<boolean> => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return false;
    }

    setIsArchiving(true);
    try {
      // First get current property info for logging
      const { data: propertyData, error: fetchError } = await supabase
        .from('properties')
        .select('title')
        .eq('id', propertyId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const propertyTitle = propertyData?.title || "Untitled property";
      
      // Update property to archived status
      const { error } = await supabase
        .from('properties')
        .update({ archived: true })
        .eq('id', propertyId);

      if (error) throw error;
      
      // Log the change
      await logPropertyChange(
        propertyId,
        "status",
        "Active",
        "Archived"
      );

      toast({
        title: "Success",
        description: `Property "${propertyTitle}" has been archived`,
      });
      
      return true;
    } catch (error) {
      console.error("Error archiving property:", error);
      toast({
        title: "Error",
        description: "Failed to archive property",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsArchiving(false);
    }
  };

  const unarchiveProperty = async (propertyId: string): Promise<boolean> => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return false;
    }
    
    setIsArchiving(true);
    try {
      // First get current property info for logging
      const { data: propertyData, error: fetchError } = await supabase
        .from('properties')
        .select('title')
        .eq('id', propertyId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const propertyTitle = propertyData?.title || "Untitled property";
      
      // Update property to unarchived status
      const { error } = await supabase
        .from('properties')
        .update({ archived: false })
        .eq('id', propertyId);

      if (error) throw error;
      
      // Log the change
      await logPropertyChange(
        propertyId,
        "status",
        "Archived",
        "Active"
      );

      toast({
        title: "Success",
        description: `Property "${propertyTitle}" has been unarchived`,
      });
      
      return true;
    } catch (error) {
      console.error("Error unarchiving property:", error);
      toast({
        title: "Error",
        description: "Failed to unarchive property",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsArchiving(false);
    }
  };

  return { archiveProperty, unarchiveProperty, isArchiving };
}
