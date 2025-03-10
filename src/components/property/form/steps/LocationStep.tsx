import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2 } from "lucide-react";

interface LocationStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  handleMapImageDelete?: () => Promise<void>;
  onAddTechnicalItem?: () => void;
}

export function LocationStep({
  formData,
  onFieldChange,
  onFetchLocationData,
  onRemoveNearbyPlace,
  handleMapImageDelete
}: LocationStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={(e) => onFieldChange && onFieldChange("address", e.target.value)}
                placeholder="Enter full property address"
              />
            </div>
            
            <div className="flex justify-end">
              {onFetchLocationData && (
                <Button 
                  type="button" 
                  onClick={onFetchLocationData}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Get Location Data
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {formData.map_image && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Map Preview</Label>
                {handleMapImageDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleMapImageDelete}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <img
                  src={formData.map_image}
                  alt="Property location map"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {formData.nearby_places && formData.nearby_places.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label>Nearby Places</Label>
              
              <div className="space-y-2">
                {formData.nearby_places.map((place, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div>
                      <div className="font-medium">{place.name}</div>
                      <div className="text-sm text-gray-500">{place.vicinity}</div>
                    </div>
                    
                    {onRemoveNearbyPlace && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onRemoveNearbyPlace(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
