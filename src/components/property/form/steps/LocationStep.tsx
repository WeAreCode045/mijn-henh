
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { MapIcon, MapPin, Navigation, Search } from "lucide-react";
import { useState } from "react";

interface LocationStepProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  location_description?: string;
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
}

export function LocationStep({
  address,
  latitude,
  longitude,
  location_description,
  map_image,
  nearby_places = [],
  onFieldChange,
  onMapImageDelete,
  onFetchLocationData,
}: LocationStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchLocationData = async () => {
    if (!onFetchLocationData) return;
    
    setIsLoading(true);
    try {
      await onFetchLocationData();
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <div className="flex gap-2">
            <Input
              id="address"
              value={address}
              onChange={(e) => onFieldChange("address", e.target.value)}
              className="flex-1"
            />
            {onFetchLocationData && (
              <Button 
                type="button" 
                onClick={handleFetchLocationData} 
                disabled={isLoading || !address}
                className="whitespace-nowrap"
              >
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Fetch Location Data
                  </>
                )}
              </Button>
            )}
          </div>
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
            {(latitude && longitude) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleFetchLocationData}
                disabled={isLoading}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Generate Map Image
              </Button>
            )}
          </div>
        )}

        {/* Nearby Places Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Nearby Places</h3>
          {nearby_places && nearby_places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearby_places.map((place, index) => (
                <div key={index} className="border rounded-md p-3 bg-gray-50">
                  <div className="font-medium">{place.name}</div>
                  <div className="text-sm text-gray-600">{place.type.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-gray-500 mt-1">{place.vicinity}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-md bg-gray-50">
              <p className="text-gray-500">No nearby places found. Use the "Fetch Location Data" button to find nearby places.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
