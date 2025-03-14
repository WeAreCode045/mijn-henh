
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CitiesListSection } from "./components/CitiesListSection";
import { FetchCitiesButton } from "./components/FetchCitiesButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Nearby Cities</h3>
        
        <FetchCitiesButton 
          onFetch={onFetchLocationData}
          isLoading={isLoadingLocationData}
          disabled={!formData.address}
        />
      </div>
      
      {nearbyCities.length > 0 ? (
        <CitiesListSection 
          cities={nearbyCities}
          toggleVisibility={toggleCityVisibility}
          isVisible={(city) => !!city.visible_in_webview}
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Alert variant="default" className="bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                No nearby cities data available. Use the "Fetch Cities" button to discover cities near this property.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
