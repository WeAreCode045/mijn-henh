
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export interface PropertyNote {
  id: string;
  property_id: string;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function usePropertyNotes(propertyId?: string) {
  const [notes, setNotes] = useState<PropertyNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchNotes = async (id = propertyId) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_notes')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setNotes(data as PropertyNote[]);
    } catch (error) {
      console.error("Error fetching property notes:", error);
      toast({
        title: "Error",
        description: "Failed to load property notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (id = propertyId, noteContent: string) => {
    if (!id) return null;
    
    try {
      const newNote = {
        property_id: id,
        title: `Note ${new Date().toLocaleDateString()}`,
        content: noteContent,
      };
      
      const { data, error } = await supabase
        .from('property_notes')
        .insert(newNote)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        setNotes(prev => [data[0] as PropertyNote, ...prev]);
        return data[0] as PropertyNote;
      }
      
      return null;
    } catch (error) {
      console.error("Error adding property note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('property_notes')
        .delete()
        .eq('id', noteId);
        
      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== noteId));
      return true;
    } catch (error) {
      console.error("Error deleting property note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      const updates = {
        content,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('property_notes')
        .update(updates)
        .eq('id', noteId)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        setNotes(prev => 
          prev.map(note => 
            note.id === noteId ? 
            { ...note, ...updates } as PropertyNote : 
            note
          )
        );
        return data[0] as PropertyNote;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating property note:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    notes,
    isLoading,
    fetchNotes,
    addNote,
    deleteNote,
    updateNote
  };
}
