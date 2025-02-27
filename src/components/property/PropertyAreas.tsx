
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyArea, PropertyImage } from "@/types/property";
import { PlusCircle, MinusCircle, Upload, X } from "lucide-react";
import { ImageSelectDialog } from "./ImageSelectDialog";
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Property Areas</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Area
        </Button>
      </div>

      {areas.map((area) => (
        <div key={area.id} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Area</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(area.id)}
            >
              <MinusCircle className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor={`area-title-${area.id}`}>Title</Label>
              <Input
                id={`area-title-${area.id}`}
                value={area.title}
                onChange={(e) =>
                  onUpdate(area.id, "title", e.target.value)
                }
                placeholder="Area Title"
              />
            </div>

            <div>
              <Label htmlFor={`area-columns-${area.id}`}>Grid Columns</Label>
              <Select
                value={String(area.columns || '2')}
                onValueChange={(value) => 
                  onUpdate(area.id, "columns", parseInt(value, 10))
                }
              >
                <SelectTrigger id={`area-columns-${area.id}`}>
                  <SelectValue placeholder="Select columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`area-description-${area.id}`}>
                Description
              </Label>
              <Textarea
                id={`area-description-${area.id}`}
                value={area.description}
                onChange={(e) =>
                  onUpdate(area.id, "description", e.target.value)
                }
                placeholder="Area Description"
              />
            </div>

            <div>
              <Label>Images</Label>
              <div className="flex items-center gap-2 mt-2">
                <ImageSelectDialog
                  images={images}
                  selectedImageIds={area.imageIds || []}
                  onSelect={(selectedIds) => {
                    onUpdate(area.id, "imageIds", selectedIds);
                  }}
                  buttonText="Select Images"
                />
              </div>
            </div>

            {area.imageIds && area.imageIds.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {area.imageIds.map((imageId) => {
                  const image = images.find((img) => img.id === imageId);
                  if (!image) return null;
                  
                  return (
                    <div
                      key={imageId}
                      className="relative rounded-md overflow-hidden group"
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onImageRemove(area.id, imageId)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
