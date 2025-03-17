
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyArea } from "@/types/property";
import { PlusCircle, MinusCircle, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyAreasProps {
  areas: PropertyArea[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
  onImageUpload: (areaId: string, files: FileList) => Promise<void>;
  isUploading?: boolean;
}

export function PropertyAreas({
  areas = [],
  onAdd,
  onRemove,
  onUpdate,
  onImageRemove,
  onImagesSelect,
  onImageUpload,
  isUploading = false,
}: PropertyAreasProps) {
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onAdd();
  };

  const handleRemove = (id: string) => {
    onRemove(id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    onUpdate(id, field, value);
  };

  const handleImageUpload = async (areaId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onImageUpload(areaId, e.target.files);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Property Areas</Label>
        <Button type="button" variant="outline" onClick={handleAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </div>

      {areas.length === 0 ? (
        <div className="text-center p-6 bg-muted/30 rounded-md">
          <p className="text-muted-foreground mb-4">No areas added yet</p>
          <Button type="button" variant="outline" onClick={handleAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Area
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {areas.map((area) => (
            <Card key={area.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {area.name || 'Unnamed Area'}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(area.id)}
                  >
                    <MinusCircle className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`area-name-${area.id}`}>Name</Label>
                    <Input
                      id={`area-name-${area.id}`}
                      value={area.name || ''}
                      onChange={(e) => handleUpdate(area.id, 'name', e.target.value)}
                      placeholder="e.g. Kitchen, Bedroom, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`area-size-${area.id}`}>Size</Label>
                    <Input
                      id={`area-size-${area.id}`}
                      value={area.size || ''}
                      onChange={(e) => handleUpdate(area.id, 'size', e.target.value)}
                      placeholder="e.g. 20m²"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`area-title-${area.id}`}>Title</Label>
                  <Input
                    id={`area-title-${area.id}`}
                    value={area.title || ''}
                    onChange={(e) => handleUpdate(area.id, 'title', e.target.value)}
                    placeholder="Display title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`area-description-${area.id}`}>Description</Label>
                  <Textarea
                    id={`area-description-${area.id}`}
                    value={area.description || ''}
                    onChange={(e) => handleUpdate(area.id, 'description', e.target.value)}
                    placeholder="Describe this area"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`area-images-${area.id}`}>Images</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`area-images-${area.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(area.id, e)}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {area.images && area.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {area.images.map((image: any, index) => (
                      <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                        <img
                          src={typeof image === 'string' ? image : image.url}
                          alt={`Area ${area.name || ''} image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => onImageRemove(area.id, typeof image === 'string' ? image : image.id)}
                        >
                          <MinusCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
