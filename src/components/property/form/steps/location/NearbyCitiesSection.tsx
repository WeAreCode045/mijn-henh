
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface NearbyCitiesSectionProps {
  formData: PropertyFormData;
  onFetchLocationData?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
}

export function NearbyCitiesSection({
  formData,
  onFetchLocationData,
  isLoadingLocationData = false,
  onFieldChange
}: NearbyCitiesSectionProps) {
  const nearbyCities = formData.nearby_cities || [];
  
  // Toggle city visibility in webview
  const toggleCityVisibility = (cityIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_cities) return;
    
    const updatedCities = [...formData.nearby_cities];
    updatedCities[cityIndex] = {
      ...updatedCities[cityIndex],
      visible_in_webview: visible
    };
    
    onFieldChange('nearby_cities', updatedCities);
  };
  
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Nearby Cities</Label>
            
            {onFetchLocationData && (
              <Button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  onFetchLocationData();
                }}
                className="flex items-center gap-2"
                disabled={isLoadingLocationData}
              >
                {isLoadingLocationData ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Building2 className="h-4 w-4" />
                )}
                {isLoadingLocationData ? "Fetching Cities..." : "Get Nearby Cities"}
              </Button>
            )}
          </div>
          
          {nearbyCities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {nearbyCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      id={`city-${index}`}
                      checked={city.visible_in_webview !== false}
                      onCheckedChange={(checked) => {
                        toggleCityVisibility(index, checked === true);
                      }}
                    />
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.distance} km</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No nearby cities found. Use the button above to fetch data.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
