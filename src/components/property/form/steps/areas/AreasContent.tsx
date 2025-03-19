
import React from 'react';
import { PropertyFormData, PropertyArea } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Image } from "lucide-react";

interface AreasContentProps {
  formData: PropertyFormData;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
}

export function AreasContent({
  formData,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload
}: AreasContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Property Areas</h2>
        <Button size="sm" variant="outline" onClick={onAddArea}>
          <Plus className="h-4 w-4 mr-1" /> Add Area
        </Button>
      </div>
      
      {formData.areas && formData.areas.length > 0 ? (
        <div className="space-y-6">
          {formData.areas.map((area: PropertyArea) => (
            <Card key={area.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
                <CardTitle className="text-lg">{area.name || 'Unnamed Area'}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveArea(area.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`area-name-${area.id}`}>Area Name</Label>
                    <Input
                      id={`area-name-${area.id}`}
                      value={area.name || ''}
                      onChange={(e) => onUpdateArea(area.id, 'name', e.target.value)}
                      placeholder="e.g., Living Room, Kitchen"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`area-size-${area.id}`}>Size</Label>
                    <Input
                      id={`area-size-${area.id}`}
                      value={area.size || ''}
                      onChange={(e) => onUpdateArea(area.id, 'size', e.target.value)}
                      placeholder="Size in sq ft"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`area-description-${area.id}`}>Description</Label>
                  <Textarea
                    id={`area-description-${area.id}`}
                    value={area.description || ''}
                    onChange={(e) => onUpdateArea(area.id, 'description', e.target.value)}
                    placeholder="Describe this area"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label className="block mb-2">Area Images</Label>
                  <div className="flex flex-wrap gap-2">
                    {area.images && area.images.length > 0 ? (
                      area.images.map((image, index) => (
                        <div 
                          key={`${area.id}-img-${index}`}
                          className="relative h-24 w-24 rounded-md overflow-hidden border"
                        >
                          <img 
                            src={typeof image === 'string' ? image : image.url} 
                            alt={`Area ${area.name} - Image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => onAreaImageRemove(area.id, typeof image === 'string' ? `${index}` : image.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No images added to this area
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`area-image-upload-${area.id}`)?.click()}
                    >
                      <Image className="h-4 w-4 mr-1" /> Upload Area Images
                    </Button>
                    <input
                      type="file"
                      id={`area-image-upload-${area.id}`}
                      className="hidden"
                      onChange={(e) => e.target.files && onAreaImageUpload(area.id, e.target.files)}
                      accept="image/*"
                      multiple
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">No areas have been added to this property.</p>
              <Button variant="outline" onClick={onAddArea}>
                <Plus className="h-4 w-4 mr-1" /> Add your first area
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
