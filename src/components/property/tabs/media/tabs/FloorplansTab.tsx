
import React, { useState } from "react";
import { PropertyData, PropertyImage, PropertyFloorplan } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableFloorplanGrid } from "../floorplans/SortableFloorplanGrid";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { AdvancedImageUploader } from "@/components/ui/AdvancedImageUploader";
import { convertToPropertyFloorplanArray } from "@/utils/propertyDataAdapters";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving?: boolean;
  setIsSaving?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FloorplansTab({ 
  property, 
  setProperty,
  isSaving = false,
  setIsSaving = () => {}
}: FloorplansTabProps) {
  const { uploadFile } = useFileUpload();
  const mixedFloorplans = property.floorplans || [];
  
  // Convert to PropertyFloorplan[] for components that expect this type
  const floorplans = convertToPropertyFloorplanArray(mixedFloorplans);

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent form submission
    
    if (!e.target.files || e.target.files.length === 0 || !property.id) {
      return;
    }
    
    setIsSaving(true);
    const files = Array.from(e.target.files);
    const newFloorplans: PropertyFloorplan[] = [];
    
    try {
      // Get the highest sort order of existing floorplans
      let highestSortOrder = 0;
      floorplans.forEach(floorplan => {
        if (floorplan.sort_order && floorplan.sort_order > highestSortOrder) {
          highestSortOrder = floorplan.sort_order;
        }
      });
      
      // Process each file
      for (const file of files) {
        // Upload file
        const publicUrl = await uploadFile(file, property.id, 'floorplans');
        
        // Increment sort order
        highestSortOrder += 1;
        
        // Create database record
        const { error, data } = await supabase
          .from('property_images')
          .insert({
            property_id: property.id,
            url: publicUrl,
            type: 'floorplan',
            sort_order: highestSortOrder
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Add to new floorplans array
        newFloorplans.push({
          id: data.id,
          url: publicUrl,
          sort_order: highestSortOrder,
          type: "floorplan"
        });
      }
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        floorplans: [...(prev.floorplans || []), ...newFloorplans]
      }));
      
      toast.success(`${newFloorplans.length} floorplan${newFloorplans.length !== 1 ? 's' : ''} uploaded`);
    } catch (error) {
      console.error("Error uploading floorplans:", error);
      toast.error("Failed to upload floorplans");
    } finally {
      setIsSaving(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleRemoveFloorplan = async (index: number) => {
    if (!property.id || !floorplans || index < 0 || index >= floorplans.length) return;
    
    setIsSaving(true);
    try {
      const floorplanToRemove = floorplans[index];
      const floorplanUrl = floorplanToRemove.url;
      const floorplanId = floorplanToRemove.id;
      
      // Delete from database if we have an ID
      if (floorplanId) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', floorplanId);
          
        if (error) throw error;
      } else if (floorplanUrl) {
        // Try to delete by URL if we don't have an ID
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', property.id)
          .eq('url', floorplanUrl)
          .eq('type', 'floorplan');
          
        if (error) throw error;
      }
      
      // Update local state
      const newFloorplans = [...floorplans];
      newFloorplans.splice(index, 1);
      
      setProperty(prev => ({
        ...prev,
        floorplans: newFloorplans
      }));
      
      toast.success("Floorplan removed");
    } catch (error) {
      console.error("Error removing floorplan:", error);
      toast.error("Failed to remove floorplan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Floorplans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AdvancedImageUploader 
          onUpload={handleFloorplanUpload} 
          isUploading={isSaving} 
          label="Upload Floorplans"
          multiple={true}
        />
        
        {floorplans.length === 0 ? (
          <div className="text-center py-6 mt-4">
            <p className="text-muted-foreground">No floorplans uploaded yet</p>
          </div>
        ) : (
          <SortableFloorplanGrid 
            floorplans={floorplans} 
            onRemoveFloorplan={handleRemoveFloorplan}
            propertyId={property.id}
          />
        )}
      </CardContent>
    </Card>
  );
}
