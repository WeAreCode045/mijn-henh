
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { MapIcon, MapPin, Navigation, Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface LocationStepProps {
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  location_description?: string;
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  formData?: PropertyFormData; // Add formData prop for better data access
}

export function LocationStep({
  formData,
  address = "",
  latitude = null,
  longitude = null,
  location_description = "",
  map_image = null,
  nearby_places = [],
  onFieldChange,
  onMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace
}: LocationStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Use values from formData if available (for better fallback)
  const effectiveAddress = formData?.address || address;
  const effectiveLatitude = formData?.latitude !== undefined ? formData.latitude : latitude;
  const effectiveLongitude = formData?.longitude !== undefined ? formData.longitude : longitude;
  const effectiveDescription = formData?.location_description || location_description;
  const effectiveMapImage = formData?.map_image || map_image;
  const effectiveNearbyPlaces = formData?.nearby_places || nearby_places || [];

  // Log the props and values used for debugging
  useEffect(() => {
    console.log("LocationStep - Props received:", { 
      address: effectiveAddress, 
      latitude: effectiveLatitude, 
      longitude: effectiveLongitude,
      formData: formData ? "available" : "unavailable"
    });
  }, [formData, effectiveAddress, effectiveLatitude, effectiveLongitude]);

  const handleFetchLocationData = async () => {
    if (!onFetchLocationData) {
      console.warn("LocationStep - No onFetchLocationData handler provided");
      return;
    }
    
    setIsLoading(true);
    try {
      await onFetchLocationData();
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveNearbyPlace = (index: number) => {
    if (!onRemoveNearbyPlace && onFieldChange && effectiveNearbyPlaces) {
      // If no explicit handler is provided, modify the array in place
      const updatedPlaces = [...effectiveNearbyPlaces];
      updatedPlaces.splice(index, 1);
      onFieldChange("nearby_places", updatedPlaces);
    } else if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFieldChange) {
      onFieldChange("address", e.target.value);
    }
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFieldChange) {
      onFieldChange("latitude", parseFloat(e.target.value) || null);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFieldChange) {
      onFieldChange("longitude", parseFloat(e.target.value) || null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onFieldChange) {
      onFieldChange("location_description", e.target.value);
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
              value={effectiveAddress}
              onChange={handleAddressChange}
              className="flex-1"
            />
            {onFetchLocationData && (
              <Button 
                type="button" 
                onClick={handleFetchLocationData} 
                disabled={isLoading || !effectiveAddress}
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
              value={effectiveLatitude || ""}
              onChange={handleLatitudeChange}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              value={effectiveLongitude || ""}
              onChange={handleLongitudeChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location_description">Location Description</Label>
          <Textarea
            id="location_description"
            value={effectiveDescription || ""}
            onChange={handleDescriptionChange}
            rows={4}
          />
        </div>

        {effectiveMapImage && (
          <div className="relative mt-4">
            <img
              src={effectiveMapImage}
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

        {!effectiveMapImage && (
          <div className="border border-dashed border-gray-300 rounded-md p-8 mt-4 flex flex-col items-center justify-center text-center">
            <MapIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              No map image available. A map will be generated based on the address or coordinates.
            </p>
            {(effectiveLatitude && effectiveLongitude) && (
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
          {effectiveNearbyPlaces && effectiveNearbyPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {effectiveNearbyPlaces.map((place, index) => (
                <div key={index} className="border rounded-md p-3 bg-gray-50 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveNearbyPlace(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="font-medium pr-6">{place.name}</div>
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
