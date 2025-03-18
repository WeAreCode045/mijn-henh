
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
  
  const floorplans = convertToPropertyFloorplanArray(mixedFloorplans);

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (!e.target.files || e.target.files.length === 0 || !property.id) {
      return;
    }
    
    setIsSaving(true);
    const files = Array.from(e.target.files);
    const newFloorplans: PropertyFloorplan[] = [];
    
    try {
      let highestSortOrder = 0;
      floorplans.forEach(floorplan => {
        if (floorplan.sort_order && floorplan.sort_order > highestSortOrder) {
          highestSortOrder = floorplan.sort_order;
        }
      });
      
      for (const file of files) {
        const publicUrl = await uploadFile(file, property.id, 'floorplans');
        
        highestSortOrder += 1;
        
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
        
        // Create a properly typed PropertyFloorplan object
        const newFloorplan: PropertyFloorplan = {
          id: data.id,
          url: publicUrl,
          property_id: property.id,
          sort_order: highestSortOrder,
          type: "floorplan"
        };
        
        newFloorplans.push(newFloorplan);
      }
      
      // Use type assertion to cast the property data update
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
      
      if (floorplanId) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', floorplanId);
          
        if (error) throw error;
      } else if (floorplanUrl) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', property.id)
          .eq('url', floorplanUrl)
          .eq('type', 'floorplan');
          
        if (error) throw error;
      }
      
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
