
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface FloorplansSectionProps {
  floorplans: string[];
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
}

export function FloorplansSection({
  floorplans,
  onFloorplanUpload,
  onRemoveFloorplan,
}: FloorplansSectionProps) {
  return (
    <div className="space-y-4">
      <Label>Floorplans (Max 10)</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {floorplans.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Floorplan ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
              onClick={() => onRemoveFloorplan(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Input
        type="file"
        onChange={onFloorplanUpload}
        accept="image/*"
        multiple
        className="mt-2"
      />
    </div>
  );
}
