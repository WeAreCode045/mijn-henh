
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X, Upload } from "lucide-react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyAreasProps {
  areas: PropertyArea[];
  images: PropertyImage[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
}

export function PropertyAreas({
  areas,
  images,
  onAdd,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
}: PropertyAreasProps) {
  // Create a hidden file input for image upload
  const createFileInput = (areaId: string, onClickCallback: () => void) => {
    const inputId = `area-images-${areaId}`;
    return (
      <>
        <input
          type="file"
          id={inputId}
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onImageUpload(areaId, e.target.files);
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClickCallback}
          className="flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </>
    );
  };

  const getImagesByIds = (imageIds: string[]): PropertyImage[] => {
    return images.filter(img => imageIds.includes(img.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-estate-800">Property Areas</h2>
        <Button onClick={onAdd} size="sm" className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </div>

      {areas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No areas have been added yet. Click "Add Area" to create a new section.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {areas.map((area) => {
            const areaImages = getImagesByIds(area.imageIds || []);
            return (
              <Card key={area.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                  onClick={() => onRemove(area.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <CardHeader>
                  <CardTitle>
                    <Input
                      value={area.title}
                      onChange={(e) => onUpdate(area.id, "title", e.target.value)}
                      placeholder="Area Title"
                      className="text-xl font-bold"
                    />
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Textarea
                    value={area.description}
                    onChange={(e) => onUpdate(area.id, "description", e.target.value)}
                    placeholder="Enter description for this area"
                    className="min-h-[100px]"
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor={`columns-${area.id}`}>Image Grid Columns</Label>
                    <Select
                      value={String(area.columns || 2)}
                      onValueChange={(value) => onUpdate(area.id, "columns", parseInt(value))}
                    >
                      <SelectTrigger id={`columns-${area.id}`} className="w-full">
                        <SelectValue placeholder="Select number of columns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Column</SelectItem>
                        <SelectItem value="2">2 Columns</SelectItem>
                        <SelectItem value="3">3 Columns</SelectItem>
                        <SelectItem value="4">4 Columns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Images</Label>
                      {createFileInput(area.id, () => {
                        document.getElementById(`area-images-${area.id}`)?.click();
                      })}
                    </div>
                    
                    {areaImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {areaImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt={area.title}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => onImageRemove(area.id, image.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-md text-gray-500 text-sm">
                        No images added to this area yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
