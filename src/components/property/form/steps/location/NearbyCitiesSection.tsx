
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  isLoadingLocationData,
  onFieldChange
}: NearbyCitiesSectionProps) {
  const nearbyCities = formData.nearby_cities || [];

  const toggleCityVisibility = (cityIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_cities) return;
    
    const updatedCities = formData.nearby_cities.map((city, idx) => 
      idx === cityIndex ? { ...city, visible_in_webview: visible } : city
    );
    
    onFieldChange('nearby_cities', updatedCities);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Nearby Cities</h3>
      
      {nearbyCities.length > 0 ? (
        <CitiesListSection 
          cities={nearbyCities}
          toggleVisibility={toggleCityVisibility}
          isVisible={(city) => !!city.visible_in_webview}
        />
      ) : (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-md">No Cities Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No nearby cities data available. Fetch location data to discover cities near this property.
            </p>
            
            <FetchCitiesButton 
              onFetch={onFetchLocationData}
              isLoading={isLoadingLocationData}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
