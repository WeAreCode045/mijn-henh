
import React, { useState, useEffect } from "react";
import { PropertyData, PropertyFloorplan } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { FloorplansCard } from "../FloorplansCard";
import { supabase } from "@/integrations/supabase/client";
import { FloorplanDatabaseFetcher } from "../floorplans/FloorplanDatabaseFetcher";
import { convertToPropertyFloorplanArray } from "@/utils/propertyDataAdapters";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FloorplansTab({
  property,
  setProperty,
  isSaving,
  setIsSaving
}: FloorplansTabProps) {
  const [localFloorplans, setLocalFloorplans] = useState<PropertyFloorplan[]>(
    Array.isArray(property.floorplans) ? property.floorplans : []
  );

  useEffect(() => {
    if (property.floorplans) {
      setLocalFloorplans(property.floorplans);
    }
  }, [property.floorplans]);

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !property.id) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${property.id}/floorplans/${Date.now()}-${index}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        // Insert into property_images table
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .insert({
            property_id: property.id,
            url: publicUrl,
            type: 'floorplan',
            sort_order: localFloorplans.length + index
          })
          .select('id')
          .single();
          
        if (imageError) throw imageError;
        
        return {
          id: imageData.id,
          url: publicUrl,
          type: 'floorplan' as const,
          columns: 12,
          title: 'Floorplan'
        };
      });
      
      const newFloorplans = await Promise.all(uploadPromises);
      const updatedFloorplans = [...localFloorplans, ...newFloorplans];
      
      setLocalFloorplans(updatedFloorplans);
      setProperty(prev => ({
        ...prev,
        floorplans: updatedFloorplans
      }));
      
    } catch (error) {
      console.error('Error uploading floorplan:', error);
    } finally {
      setIsSaving(false);
      e.target.value = '';
    }
  };
  
  const handleRemoveFloorplan = async (index: number) => {
    if (!property.id || !localFloorplans[index]) return;
    
    setIsSaving(true);
    
    try {
      const floorplanToRemove = localFloorplans[index];
      
      // Delete from database
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', floorplanToRemove.id);
        
      if (error) throw error;
      
      // Update local state
      const updatedFloorplans = localFloorplans.filter((_, i) => i !== index);
      setLocalFloorplans(updatedFloorplans);
      setProperty(prev => ({
        ...prev,
        floorplans: updatedFloorplans
      }));
      
    } catch (error) {
      console.error('Error removing floorplan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Callback for when floorplans are fetched from the database
  const handleFloorplansFetched = (floorplans: PropertyFloorplan[]) => {
    if (floorplans.length > 0) {
      setLocalFloorplans(floorplans);
      setProperty(prev => ({
        ...prev,
        floorplans
      }));
    }
  };

  return (
    <>
      {/* Fetch floorplans from database if not already loaded */}
      <FloorplanDatabaseFetcher 
        propertyId={property.id} 
        floorplans={localFloorplans}
        onFetchComplete={handleFloorplansFetched}
      />
      
      <FloorplansCard
        floorplans={localFloorplans}
        onFloorplanUpload={handleFloorplanUpload}
        onRemoveFloorplan={handleRemoveFloorplan}
        isUploading={isSaving}
        propertyId={property.id}
      />
    </>
  );
}
