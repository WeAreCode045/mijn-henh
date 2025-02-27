
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormData } from "@/types/property";
import { MapIcon } from "lucide-react";

interface LocationStepProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  location_description?: string;
  map_image?: string | null;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onMapImageDelete?: () => Promise<void>;
}

export function LocationStep({
  address,
  latitude,
  longitude,
  location_description,
  map_image,
  onFieldChange,
  onMapImageDelete,
}: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => onFieldChange("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              value={latitude || ""}
              onChange={(e) => onFieldChange("latitude", parseFloat(e.target.value) || null)}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              value={longitude || ""}
              onChange={(e) => onFieldChange("longitude", parseFloat(e.target.value) || null)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location_description">Location Description</Label>
          <Textarea
            id="location_description"
            value={location_description || ""}
            onChange={(e) => onFieldChange("location_description", e.target.value)}
            rows={4}
          />
        </div>

        {map_image && (
          <div className="relative mt-4">
            <img
              src={map_image}
              alt="Location Map"
              className="w-full h-64 object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onMapImageDelete}
            >
              Remove Map
            </Button>
          </div>
        )}

        {!map_image && (
          <div className="border border-dashed border-gray-300 rounded-md p-8 mt-4 flex flex-col items-center justify-center text-center">
            <MapIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              No map image available. A map will be generated based on the address or coordinates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
