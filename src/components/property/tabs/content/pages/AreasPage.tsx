import React, { useState } from "react";
import { PropertyFormData, PropertyArea } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Upload, Edit, Save } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AreasPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
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
  isUploading = false,
  setPendingChanges
}: AreasPageProps) {
  const { toast } = useToast();
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editableAreas, setEditableAreas] = useState<Record<string, PropertyArea>>({});

  // Start editing a specific area
  const startEditingArea = (areaId: string) => {
    const areaToEdit = formData.areas?.find(area => area.id === areaId);
    if (areaToEdit) {
      setEditableAreas({
        ...editableAreas,
        [areaId]: { ...areaToEdit }
      });
      setEditingAreaId(areaId);
    }
  };

  // Update area field in local state
  const updateAreaField = (areaId: string, field: string, value: any) => {
    setEditableAreas({
      ...editableAreas,
      [areaId]: {
        ...editableAreas[areaId],
        [field]: value
      }
    });
  };

  // Save area changes
  const saveArea = async (areaId: string) => {
    if (!formData.id) return;
    
    setIsSaving(true);
    try {
      const updatedArea = editableAreas[areaId];
      const updatedAreas = formData.areas?.map(area => 
        area.id === areaId ? updatedArea : area
      ) || [];
      
      const { error } = await supabase
        .from('properties')
        .update({ 
          areas: updatedAreas
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Update parent state
      onFieldChange('areas', updatedAreas);
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: `Area "${updatedArea.name}" updated successfully`,
      });
      
      setEditingAreaId(null);
    } catch (error) {
      console.error("Error updating area:", error);
      toast({
        title: "Error",
        description: "Could not update area",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new area
  const addNewArea = () => {
    onAddArea();
    if (setPendingChanges) setPendingChanges(true);
  };

  // Delete an area
  const deleteArea = (areaId: string) => {
    onRemoveArea(areaId);
    if (setPendingChanges) setPendingChanges(true);
    
    // If we were editing this area, clear editing state
    if (editingAreaId === areaId) {
      setEditingAreaId(null);
    }
  };

  // Handle file upload for an area
  const handleFileUpload = async (areaId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await onAreaImageUpload(areaId, files);
      if (setPendingChanges) setPendingChanges(true);
    }
  };

  // Remove an image from an area
  const removeImage = (areaId: string, imageId: string) => {
    onAreaImageRemove(areaId, imageId);
    if (setPendingChanges) setPendingChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Areas list */}
      {formData.areas && formData.areas.length > 0 ? (
        formData.areas.map(area => (
          <Card key={area.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                {area.name || 'Unnamed Area'}
              </CardTitle>
              <div className="flex gap-2">
                {editingAreaId === area.id ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => saveArea(area.id)}
                    disabled={isSaving}
                    className="flex items-center gap-1"
                  >
                    {isSaving ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditingArea(area.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteArea(area.id)}
                  className="flex items-center gap-1"
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingAreaId === area.id ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`area-name-${area.id}`}>Name</Label>
                    <Input
                      id={`area-name-${area.id}`}
                      value={editableAreas[area.id]?.name || ''}
                      onChange={(e) => updateAreaField(area.id, 'name', e.target.value)}
                      placeholder="Area name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`area-description-${area.id}`}>Description</Label>
                    <Textarea
                      id={`area-description-${area.id}`}
                      value={editableAreas[area.id]?.description || ''}
                      onChange={(e) => updateAreaField(area.id, 'description', e.target.value)}
                      placeholder="Area description"
                      rows={3}
                    />
                  </div>
                  
                  {/* Images section */}
                  <div>
                    <Label className="block mb-2">Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                      {area.images && area.images.length > 0 ? (
                        area.images.map(image => (
                          <div key={image.id} className="relative group">
                            <img 
                              src={image.url} 
                              alt={area.name || 'Area'} 
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(area.id, image.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground col-span-full">No images added yet.</p>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <Label htmlFor={`area-images-${area.id}`} className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors">
                          <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground block">
                            {isUploading ? 'Uploading...' : 'Click to upload images'}
                          </span>
                        </div>
                      </Label>
                      <Input
                        id={`area-images-${area.id}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(area.id, e)}
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="whitespace-pre-wrap">{area.description || 'No description provided.'}</p>
                  </div>
                  
                  {/* Display images in read mode */}
                  {area.images && area.images.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {area.images.map(image => (
                          <div key={image.id} className="relative">
                            <img 
                              src={image.url} 
                              alt={area.name || 'Area'} 
                              className="w-full h-24 object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-4">No areas added yet.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Add area button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addNewArea}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Area
      </Button>
    </div>
  );
}
