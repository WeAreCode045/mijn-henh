import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function usePropertyNotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();
  
  const addNote = useCallback(async (propertyId: string, noteContent: string) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add a note.",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('property_notes')
        .insert([
          { 
            property_id: propertyId, 
            user_id: user.id, 
            content: noteContent 
          }
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Note added successfully!",
      });

      // Log the property edit
      await logPropertyChange(propertyId, "note", `Added new note: ${noteContent.substring(0, 30)}...`);
      
      return data;
    } catch (error: any) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add note.",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast, logPropertyChange]);
  
  return { addNote };
}
