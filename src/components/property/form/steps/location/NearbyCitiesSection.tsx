
import { PropertyFormData, PropertyCity } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CitiesListSection } from "./components/CitiesListSection";
import { FetchCitiesButton } from "./components/FetchCitiesButton";

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
              <FetchCitiesButton 
                onFetch={onFetchLocationData}
                isLoading={isLoadingLocationData}
              />
            )}
          </div>
          
          <CitiesListSection 
            nearbyCities={nearbyCities}
            toggleCityVisibility={toggleCityVisibility}
          />
        </div>
      </CardContent>
    </Card>
  );
}
