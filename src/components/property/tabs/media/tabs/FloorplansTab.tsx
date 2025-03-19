
import React, { useState, useEffect } from "react";
import { PropertyData, PropertyFloorplan } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon, Code } from "lucide-react";
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
  const [floorplanEmbedScript, setFloorplanEmbedScript] = useState<string>(
    property.floorplanEmbedScript || ""
  );

  useEffect(() => {
    if (property.floorplans) {
      setLocalFloorplans(property.floorplans);
    }
    
    if (property.floorplanEmbedScript !== undefined) {
      setFloorplanEmbedScript(property.floorplanEmbedScript);
    }
  }, [property.floorplans, property.floorplanEmbedScript]);

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
  
  const handleSaveFloorplanEmbedScript = async () => {
    if (!property.id) return;
    
    setIsSaving(true);
    
    try {
      // Update the property with the new floorplan embed script
      const { error } = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          floorplanEmbedScript
        }),
      }).then(res => res.json());
      
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        floorplanEmbedScript
      }));
      
    } catch (error) {
      console.error('Error saving floorplan embed script:', error);
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
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Floorplan Embed Script
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste a floorplan embed script from a third-party provider here.
          </p>
          <div className="space-y-2">
            <Textarea
              value={floorplanEmbedScript}
              onChange={(e) => setFloorplanEmbedScript(e.target.value)}
              placeholder="Paste floorplan embed script here"
              rows={4}
            />
            <Button onClick={handleSaveFloorplanEmbedScript} disabled={isSaving}>
              Save Script
            </Button>
          </div>
          {floorplanEmbedScript && (
            <div className="mt-4 border p-4 rounded-md">
              <h4 className="font-medium mb-2">Preview:</h4>
              <div dangerouslySetInnerHTML={{ __html: floorplanEmbedScript }} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
