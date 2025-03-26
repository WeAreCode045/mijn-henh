import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function usePropertyArchive() {
  const [isArchiving, setIsArchiving] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const archiveProperty = async (propertyId: string, isArchived: boolean) => {
    setIsArchiving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ archived: isArchived })
        .eq('id', propertyId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Property ${isArchived ? 'archived' : 'unarchived'} successfully`,
      });

      // Log the property edit
      await logPropertyChange(propertyId, "archive", `Property ${isArchived ? 'archived' : 'unarchived'}`);
    } catch (error) {
      console.error("Error archiving property:", error);
      toast({
        title: "Error",
        description: `Failed to ${isArchived ? 'archive' : 'unarchive'} property`,
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return {
    isArchiving,
    archiveProperty,
  };
}
