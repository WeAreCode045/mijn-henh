
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyArchive() {
  const [isArchiving, setIsArchiving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const archiveProperty = async (propertyId: string): Promise<boolean> => {
    if (!propertyId) return false;
    
    setIsArchiving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ archived: true })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property has been archived",
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
    if (!propertyId) return false;
    
    setIsArchiving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ archived: false })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property has been unarchived and can now be edited",
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

  return {
    archiveProperty,
    unarchiveProperty,
    isArchiving
  };
}
