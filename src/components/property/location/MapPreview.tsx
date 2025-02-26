
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface MapPreviewProps {
  map_image: string;
  onDelete: () => void;
}

export function MapPreview({ map_image, onDelete }: MapPreviewProps) {
  return (
    <div className="mt-4">
      <Label>Location Preview</Label>
      <div className="mt-2 relative group">
        <div className="relative aspect-video rounded-lg overflow-hidden border">
          <img 
            src={map_image} 
            alt="Property location"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
