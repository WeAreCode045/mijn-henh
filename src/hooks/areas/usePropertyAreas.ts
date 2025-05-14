
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyArea } from '@/types/property';
import { useToast } from '@/hooks/use-toast';

// Define the possible area types
export type AreaType = 'interior' | 'exterior' | 'other';

export function usePropertyAreas(propertyId: string) {
  const [areas, setAreas] = useState<PropertyArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch all areas for a property
  const fetchAreas = async () => {
    if (!propertyId) return;
    
    try {
      setLoading(true);
      
      // Query the database for areas associated with this property
      const { data, error } = await supabase
        .from('property_areas')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      // Transform the data into the PropertyArea type
      const transformedAreas = data?.map(area => ({
        id: area.id,
        name: area.name || '',
        description: area.description || '',
        images: area.images || [],
        type: (area.type as AreaType) || 'interior',
        display_order: area.display_order || 0,
        property_id: area.property_id
      })) || [];
      
      setAreas(transformedAreas);
    } catch (err) {
      console.error("Error fetching property areas:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch property areas'));
      toast({
        title: "Error",
        description: "Failed to load property areas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new area to the property
  const addArea = async (newArea: Omit<PropertyArea, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('property_areas')
        .insert({ 
          name: newArea.name,
          description: newArea.description,
          images: newArea.images || [],
          type: newArea.type || 'interior',
          display_order: newArea.display_order || 0,
          property_id: propertyId
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const addedArea: PropertyArea = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          images: data[0].images || [],
          type: (data[0].type as AreaType) || 'interior',
          display_order: data[0].display_order || 0,
          property_id: data[0].property_id
        };
        
        setAreas([...areas, addedArea]);
        
        return { success: true, area: addedArea };
      }
      
      return { success: false };
    } catch (err) {
      console.error("Error adding property area:", err);
      toast({
        title: "Error",
        description: "Failed to add property area",
        variant: "destructive",
      });
      return { success: false, error: err };
    }
  };

  // Update an existing area
  const updateArea = async (areaId: string, updatedData: Partial<PropertyArea>) => {
    try {
      const { error } = await supabase
        .from('property_areas')
        .update({ 
          name: updatedData.name,
          description: updatedData.description,
          images: updatedData.images,
          type: updatedData.type,
          display_order: updatedData.display_order
        })
        .eq('id', areaId);
        
      if (error) throw error;
      
      // Update the areas state with the updated area
      setAreas(areas.map(area => 
        area.id === areaId ? { ...area, ...updatedData } : area
      ));
      
      return { success: true };
    } catch (err) {
      console.error("Error updating property area:", err);
      toast({
        title: "Error",
        description: "Failed to update property area",
        variant: "destructive",
      });
      return { success: false, error: err };
    }
  };

  // Delete an area
  const deleteArea = async (areaId: string) => {
    try {
      const { error } = await supabase
        .from('property_areas')
        .delete()
        .eq('id', areaId);
        
      if (error) throw error;
      
      // Remove the deleted area from the state
      setAreas(areas.filter(area => area.id !== areaId));
      
      return { success: true };
    } catch (err) {
      console.error("Error deleting property area:", err);
      toast({
        title: "Error",
        description: "Failed to delete property area",
        variant: "destructive",
      });
      return { success: false, error: err };
    }
  };

  // Sort areas by updating their display_order
  const reorderAreas = async (reorderedAreas: PropertyArea[]) => {
    try {
      // Create an array of update operations
      const updates = reorderedAreas.map((area, index) => {
        return {
          id: area.id,
          display_order: index
        };
      });
      
      // Perform the updates
      const { error } = await supabase
        .from('property_areas')
        .upsert(updates);
        
      if (error) throw error;
      
      // Update the areas state with the new order
      setAreas(reorderedAreas);
      
      return { success: true };
    } catch (err) {
      console.error("Error reordering property areas:", err);
      toast({
        title: "Error",
        description: "Failed to reorder property areas",
        variant: "destructive",
      });
      return { success: false, error: err };
    }
  };

  // Fetch areas when the propertyId changes
  useEffect(() => {
    if (propertyId) {
      fetchAreas();
    }
  }, [propertyId]);

  return {
    areas,
    loading,
    error,
    fetchAreas,
    addArea,
    updateArea,
    deleteArea,
    reorderAreas
  };
}
