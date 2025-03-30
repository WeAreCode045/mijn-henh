
import React, { useState, useEffect } from "react";
import { PropertyFormData, PropertyImage, PropertyArea } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AreasList } from "@/components/property/form/steps/areas/AreasList";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { prepareAreasForFormSubmission } from "@/hooks/property-form/preparePropertyData";
import { v4 as uuidv4 } from "uuid";

interface AreasPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  onReorderAreaImages?: (areaId: string, reorderedImageIds: string[]) => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function AreasPage({
  formData,
  onFieldChange,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImageUpload,
  onAreaImagesSelect,
  onReorderAreaImages,
  isUploading = false,
  setPendingChanges
}: AreasPageProps) {
  // Local state for areas
  const [localAreas, setLocalAreas] = useState<PropertyArea[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Initialize local state from formData
  useEffect(() => {
    setLocalAreas(formData.areas || []);
  }, [formData.areas]);
  
  // Save areas to database
  const saveAreas = async () => {
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Prepare areas for submission (clean and format data)
      const preparedAreas = prepareAreasForFormSubmission(localAreas);
      
      const { error } = await supabase
        .from('properties')
        .update({ areas: preparedAreas })
        .eq('id', formData.id);
        
      if (error) {
        console.error("Error saving areas:", error);
        toast({
          title: "Error",
          description: "Failed to save areas",
          variant: "destructive"
        });
      } else {
        console.log("Areas saved to database successfully");
        toast({
          title: "Success",
          description: "Areas updated successfully",
        });
        
        // Update parent state
        onFieldChange("areas", localAreas);
        
        if (setPendingChanges) {
          setPendingChanges(false);
        }
        
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Failed to save areas:", err);
      toast({
        title: "Error",
        description: "Failed to save areas",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Local handlers
  const handleAddArea = () => {
    console.log("Adding new area");
    
    const newArea: PropertyArea = {
      id: uuidv4(),
      title: 'New Area',
      name: 'New Area',
      size: '',
      description: '',
      images: [],
      imageIds: [],
      columns: 2,
      areaImages: []
    };
    
    const updatedAreas = [...localAreas, newArea];
    setLocalAreas(updatedAreas);
    setHasChanges(true);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
    
    toast({
      title: "Area added",
      description: "New area has been added. Don't forget to save your changes."
    });
  };
  
  const handleRemoveArea = (id: string) => {
    console.log("Removing area", id);
    const updatedAreas = localAreas.filter(area => area.id !== id);
    setLocalAreas(updatedAreas);
    setHasChanges(true);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleUpdateArea = (id: string, field: any, value: any) => {
    console.log(`Updating area ${id}, field ${field} with value:`, value);
    const updatedAreas = localAreas.map(area => {
      if (area.id === id) {
        return { ...area, [field]: value };
      }
      return area;
    });
    
    setLocalAreas(updatedAreas);
    setHasChanges(true);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAreaImageRemove = (areaId: string, imageId: string) => {
    if (!onAreaImageRemove) return;
    
    console.log(`Removing image ${imageId} from area ${areaId}`);
    
    // Update local state
    const updatedAreas = localAreas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          images: Array.isArray(area.images) 
            ? area.images.filter(img => {
                if (typeof img === 'string') return img !== imageId;
                return img.id !== imageId;
              })
            : [],
          imageIds: Array.isArray(area.imageIds) 
            ? area.imageIds.filter(id => id !== imageId)
            : []
        };
      }
      return area;
    });
    
    setLocalAreas(updatedAreas);
    setHasChanges(true);
    
    // Call the original handler for actual removal
    onAreaImageRemove(areaId, imageId);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAreaImagesSelect = async (areaId: string, imageIds: string[]) => {
    if (!onAreaImagesSelect) return;
    
    console.log(`Selecting images for area ${areaId}:`, imageIds);
    
    // Update local state
    const updatedAreas = localAreas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          imageIds: imageIds
        };
      }
      return area;
    });
    
    setLocalAreas(updatedAreas);
    setHasChanges(true);
    
    // Call the original handler for actual selection
    onAreaImagesSelect(areaId, imageIds);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleReorderAreaImages = (areaId: string, reorderedImageIds: string[]) => {
    console.log(`Reordering images for area ${areaId}:`, reorderedImageIds);
    
    // Update local state
    const updatedAreas = localAreas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          imageIds: reorderedImageIds
        };
      }
      return area;
    });
    
    setLocalAreas(updatedAreas);
    setHasChanges(true);
    
    // Call the original handler for actual reordering if provided
    if (onReorderAreaImages) {
      onReorderAreaImages(areaId, reorderedImageIds);
    }
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  // Handle area reordering
  const handleReorderAreas = (reorderedAreas: any) => {
    console.log("Reordering areas", reorderedAreas);
    setLocalAreas(reorderedAreas);
    setHasChanges(true);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Property Areas</CardTitle>
          <Button
            size="sm"
            onClick={handleAddArea}
            className="flex items-center gap-1"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Area
          </Button>
        </CardHeader>
        <CardContent>
          <AreasList
            areas={localAreas || []}
            onRemove={handleRemoveArea}
            onUpdate={handleUpdateArea}
            onAreaImageRemove={onAreaImageRemove ? handleAreaImageRemove : undefined}
            onAreaImageUpload={onAreaImageUpload}
            onAreaImagesSelect={onAreaImagesSelect ? handleAreaImagesSelect : undefined}
            onReorderAreaImages={handleReorderAreaImages}
            propertyImages={formData.images as PropertyImage[]}
            isUploading={isUploading}
            onReorder={handleReorderAreas}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={saveAreas} 
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Areas
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
