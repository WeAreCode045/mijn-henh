
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface PropertyNote {
  id: string;
  property_id: string;
  title: string;
  content: string;
  created_at: string;
}

export function usePropertyNotes(propertyId: string) {
  const [notes, setNotes] = useState<PropertyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_notes')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to load property notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('property_notes')
        .insert({
          property_id: propertyId,
          title,
          content
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      
      fetchNotes();
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('property_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      
      fetchNotes();
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchNotes();
    }
  }, [propertyId]);

  return {
    notes,
    isLoading,
    addNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
}
