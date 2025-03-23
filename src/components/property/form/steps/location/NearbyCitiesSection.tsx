
import { PropertyFormData, PropertyCity } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { CitiesListSection } from "./components/CitiesListSection";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { SelectCitiesModal } from "./components/SelectCitiesModal";

interface NearbyCitiesSectionProps {
  formData: PropertyFormData;
  onFetchLocationData?: () => Promise<void>;
  onFetchNearbyCities?: () => Promise<any>;
  isLoadingLocationData?: boolean;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
}

export function NearbyCitiesSection({ 
  formData,
  onFetchLocationData,
  onFetchNearbyCities,
  isLoadingLocationData,
  onFieldChange
}: NearbyCitiesSectionProps) {
  const nearbyCities = formData.nearby_cities || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [citiesForModal, setCitiesForModal] = useState<PropertyCity[]>(nearbyCities);
  const [isFetchingCities, setIsFetchingCities] = useState(false);

  const toggleCityVisibility = (cityIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_cities) return;
    
    const updatedCities = formData.nearby_cities.map((city, idx) => 
      idx === cityIndex ? { ...city, visible_in_webview: visible } : city
    );
    
    onFieldChange('nearby_cities', updatedCities);
  };

  const handleFetchCities = async () => {
    if (!onFetchNearbyCities) return;
    
    setIsFetchingCities(true);
    
    try {
      const results = await onFetchNearbyCities();
      if (results && results.cities) {
        setCitiesForModal(results.cities);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsFetchingCities(false);
    }
  };

  const handleSaveCities = (selectedCities: PropertyCity[]) => {
    if (!onFieldChange) return;
    
    // Make sure all cities have visible_in_webview set
    const citiesToSave = selectedCities.map(city => ({
      ...city,
      visible_in_webview: true
    }));
    
    onFieldChange('nearby_cities', citiesToSave);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Nearby Cities</h3>
        
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={onFetchNearbyCities ? handleFetchCities : onFetchLocationData}
          disabled={isLoadingLocationData || isFetchingCities || !formData.address}
          className="flex gap-2 items-center"
        >
          {isLoadingLocationData || isFetchingCities ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Fetching...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Fetch Cities
            </>
          )}
        </Button>
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
      
      {/* Modal for selecting cities */}
      <SelectCitiesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cities={citiesForModal}
        onSave={handleSaveCities}
        isLoading={isFetchingCities}
      />
    </div>
  );
}
