
import React, { useState } from "react";
import { PropertyFormData, PropertyTechnicalItem, PropertyFloorplan } from "@/types/property";
import { TechnicalItemsList } from "./components/TechnicalItemsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TechnicalDataContainerProps {
  formData?: PropertyFormData;
  technicalItems?: PropertyTechnicalItem[];
  floorplans?: PropertyFloorplan[];
  images?: any[];
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  onTechnicalItemFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>, technicalItemId: string) => void;
  isUploading?: boolean;
}

export function TechnicalDataContainer({
  formData,
  technicalItems = [],
  floorplans = [],
  images = [],
  onFieldChange,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan,
  onTechnicalItemFloorplanUpload,
  isUploading
}: TechnicalDataContainerProps) {
  const [uploading, setUploading] = useState(false);
  const [invalidImageUrls, setInvalidImageUrls] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  // Handle standalone floorplan upload - not tied to a technical item
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFloorplanUpload || !e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      await onFloorplanUpload(e);
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  // Track invalid image URLs
  const handleImageError = (url: string) => {
    setInvalidImageUrls(prev => {
      const updated = new Set(prev);
      updated.add(url);
      return updated;
    });
  };

  // Enhanced floorplan removal function
  const handleRemoveFloorplan = async (index: number) => {
    // First call the provided removal handler which handles storage deletion
    if (onRemoveFloorplan) {
      await onRemoveFloorplan(index);
    }

    // Let's also make sure database records are cleaned up
    // Especially if we're dealing with an existing property
    if (formData?.id && floorplans && floorplans[index]) {
      try {
        const floorplanToRemove = floorplans[index];
        const url = floorplanToRemove.url;

        // Remove the record from property_images table if it exists
        if (url) {
          const { error } = await supabase
            .from('property_images')
            .delete()
            .eq('url', url)
            .eq('property_id', formData.id);
            
          if (error) {
            console.error('Error removing floorplan from database:', error);
            toast({
              title: "Warning",
              description: "The floorplan was removed but there might be database records that weren't fully cleaned up.",
              variant: "destructive"
            });
          }
        }

        // Check if any technical items reference this floorplan and update them
        if (technicalItems && floorplanToRemove.id) {
          const updatedTechnicalItems = technicalItems.map(item => {
            if (item.floorplanId === floorplanToRemove.id) {
              return { ...item, floorplanId: null };
            }
            return item;
          });
          
          if (onFieldChange) {
            onFieldChange('technicalItems', updatedTechnicalItems);
          }
        }
      } catch (error) {
        console.error('Error cleaning up floorplan database references:', error);
      }
    }
  };

  // Filter out invalid floorplans
  const validFloorplans = floorplans.filter(floorplan => 
    floorplan && 
    floorplan.url && 
    !invalidImageUrls.has(floorplan.url)
  );
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Technical Data</h3>
      <p className="text-muted-foreground text-sm">
        Add detailed information about technical aspects of the property.
      </p>
      
      {/* Standalone floorplan upload section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Property Floorplans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floorplan-upload">Upload Floorplans</Label>
            <div className="flex items-center gap-2">
              <Input
                id="floorplan-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFloorplanUpload}
                disabled={uploading || isUploading}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10" 
                disabled={uploading || isUploading}
                asChild
              >
                <label htmlFor="floorplan-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                </label>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload floorplan images that can be linked to specific areas of the property.
            </p>
          </div>
          
          {/* Display uploaded floorplans */}
          {validFloorplans && validFloorplans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {validFloorplans.map((floorplan, index) => (
                <div key={floorplan.id || `floorplan-${index}`} className="relative group">
                  <img 
                    src={floorplan.url} 
                    alt={`Floorplan ${index + 1}`} 
                    className="w-full h-auto aspect-square object-cover rounded-md border"
                    onError={() => handleImageError(floorplan.url)}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleRemoveFloorplan(index)}
                      type="button"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-md text-gray-500">
              No floorplans uploaded yet
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Technical items section */}
      <TechnicalItemsList 
        items={technicalItems} 
        floorplans={validFloorplans}
        onAdd={onAddTechnicalItem || (() => {})} 
        onRemove={onRemoveTechnicalItem || (() => {})} 
        onUpdate={onUpdateTechnicalItem || (() => {})}
        onFloorplanUpload={onTechnicalItemFloorplanUpload}
      />
    </div>
  );
}
