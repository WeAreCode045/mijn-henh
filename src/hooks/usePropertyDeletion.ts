
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function usePropertyDeletion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const deleteProperty = async (id?: string) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      navigate('/properties');
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteProperty, isDeleting };
}
