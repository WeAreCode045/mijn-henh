
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyArea, PropertyImage } from "@/types/property";
import { PlusCircle, MinusCircle, ImagePlus, Trash2 } from "lucide-react";
import { ImageSelectDialog } from "./ImageSelectDialog";

interface PropertyAreasProps {
  areas: PropertyArea[];
  images: PropertyImage[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[]) => void;
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Areas and Floors</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Area
        </Button>
      </div>
      {areas.map((area) => (
        <div key={area.id} className="space-y-4 border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Input
              value={area.title}
              onChange={(e) => onUpdate(area.id, 'title', e.target.value)}
              placeholder="Area Title"
              className="flex-1 mr-2"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(area.id)}
            >
              <MinusCircle className="w-4 h-4 text-destructive" />
            </Button>
          </div>
          <Textarea
            value={area.description}
            onChange={(e) => onUpdate(area.id, 'description', e.target.value)}
            placeholder="Area Description"
          />
          <div className="space-y-2">
            <Label>Area Images</Label>
            <ImageSelectDialog 
              images={images}
              onSelect={(selectedImages) => {
                onUpdate(area.id, 'imageIds', selectedImages);
              }}
              buttonText="Select Images"
            />
            {area.imageIds && area.imageIds.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {area.imageIds.map((imageId) => {
                  const image = images.find(img => img.id === imageId);
                  if (!image) return null;
                  
                  return (
                    <div key={imageId} className="relative group">
                      <img
                        src={image.url}
                        alt="Area"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newImageIds = area.imageIds.filter(id => id !== imageId);
                          onUpdate(area.id, 'imageIds', newImageIds);
                          onImageRemove(area.id, imageId);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
