
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface AreaPhotosSectionProps {
  areaPhotos: string[];
  onAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAreaPhoto: (index: number) => void;
}

export function AreaPhotosSection({
  areaPhotos,
  onAreaPhotosUpload,
  onRemoveAreaPhoto,
}: AreaPhotosSectionProps) {
  return (
    <div className="space-y-4">
      <Label>Area Photos (Max 15)</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {areaPhotos.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Area photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
              onClick={() => onRemoveAreaPhoto(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {areaPhotos.length < 15 && (
          <Input
            type="file"
            onChange={onAreaPhotosUpload}
            accept="image/*"
            multiple
            className="mt-2"
            disabled={areaPhotos.length >= 15}
          />
        )}
      </div>
    </div>
  );
}
