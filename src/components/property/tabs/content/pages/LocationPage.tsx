import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2 } from "lucide-react";
import { EditButton } from "@/components/property/content/EditButton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NearbyPlaces } from "@/components/property/location/NearbyPlaces";
import { preparePropertiesForJsonField } from "@/hooks/property-form/preparePropertyData";
import { SelectPlacesModal } from "@/components/property/form/steps/location/components/SelectPlacesModal";
import { PlaceOption } from "@/components/property/form/steps/location/components/SelectPlacesModal";
import { SelectCitiesModal } from "@/components/property/form/steps/location/components/SelectCitiesModal";

interface LocationPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function LocationPage({
  formData,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  isLoadingLocationData = false,
  setPendingChanges
}: LocationPageProps) {
  const { toast } = useToast();
  const [isEditingLocationDesc, setIsEditingLocationDesc] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [locationDescription, setLocationDescription] = useState(formData.location_description || '');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [placesForModal, setPlacesForModal] = useState<PlaceOption[]>([]);
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);
  
  const [citiesModalOpen, setCitiesModalOpen] = useState(false);
  const [citiesForModal, setCitiesForModal] = useState<any[]>([]);
  const [isFetchingCities, setIsFetchingCities] = useState(false);

  const generateDescription = async () => {
    if (onGenerateLocationDescription) {
      await onGenerateLocationDescription();
      setLocationDescription(formData.location_description || '');
    }
  };

  const saveLocationDescription = async () => {
    if (!formData.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          location_description: locationDescription
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      onFieldChange('location_description', locationDescription);
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "Location description updated successfully",
      });
      
      setIsEditingLocationDesc(false);
    } catch (error) {
      console.error("Error updating location description:", error);
      toast({
        title: "Error",
        description: "Could not update location description",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveNearbyPlaces = async (): Promise<void> => {
    if (!formData.id) return;
    
    try {
      const nearbyPlacesJson = preparePropertiesForJsonField(formData.nearby_places || []);
      const nearbyCitiesJson = preparePropertiesForJsonField(formData.nearby_cities || []);
      
      const { error } = await supabase
        .from('properties')
        .update({ 
          nearby_places: nearbyPlacesJson,
          nearby_cities: nearbyCitiesJson
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "Nearby places and cities updated successfully",
      });
    } catch (error) {
      console.error("Error updating nearby places:", error);
      toast({
        title: "Error",
        description: "Could not update nearby places",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const handleFetchCategoryPlaces = async (category: string) => {
    if (!onFetchCategoryPlaces || !formData.address) {
      toast({
        title: "Error",
        description: "Address is required to fetch nearby places",
        variant: "destructive",
      });
      return;
    }
    
    setIsFetchingCategory(true);
    setCurrentCategory(category);
    
    try {
      const results = await onFetchCategoryPlaces(category);
      
      if (results && results[category] && Array.isArray(results[category])) {
        const options: PlaceOption[] = results[category].map((place: any) => ({
          id: place.id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          distance: place.distance,
          type: place.type || category,
          maxSelections: 5
        }));
        
        setPlacesForModal(options);
        setModalOpen(true);
      } else {
        toast({
          title: "No places found",
          description: `No ${category.replace('_', ' ')} places found near this location.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby places.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingCategory(false);
    }
  };
  
  const handleFetchCities = async () => {
    if (!onFetchNearbyCities || !formData.address) {
      toast({
        title: "Error",
        description: "Address is required to fetch nearby cities",
        variant: "destructive",
      });
      return;
    }
    
    setIsFetchingCities(true);
    
    try {
      const results = await onFetchNearbyCities();
      
      if (results && results.cities && Array.isArray(results.cities)) {
        setCitiesForModal(results.cities);
        setCitiesModalOpen(true);
      } else {
        toast({
          title: "No cities found",
          description: "No nearby cities found for this location.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby cities.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingCities(false);
    }
  };
  
  const handleSavePlaces = async (selectedPlaces: PlaceOption[]) => {
    if (!formData.nearby_places) return;
    
    const newPlaces = selectedPlaces.map(place => ({
      id: place.id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      distance: place.distance || 0,
      type: place.type,
      visible_in_webview: true
    }));
    
    const existingPlaces = formData.nearby_places.filter(
      place => !newPlaces.some(newPlace => newPlace.id === place.id)
    );
    
    const updatedPlaces = [...existingPlaces, ...newPlaces];
    onFieldChange('nearby_places', updatedPlaces);
    
    await saveNearbyPlaces();
  };
  
  const handleSaveCities = async (selectedCities: any[]) => {
    const citiesToSave = selectedCities.map(city => ({
      ...city,
      visible_in_webview: true
    }));
    
    onFieldChange('nearby_cities', citiesToSave);
    
    await saveNearbyPlaces();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Location Description</CardTitle>
          <div className="flex gap-2">
            {isEditingLocationDesc && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={isLoadingLocationData || !formData.address}
                className="flex gap-2 items-center"
              >
                {isLoadingLocationData ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            )}
            <EditButton
              isEditing={isEditingLocationDesc}
              onToggle={() => setIsEditingLocationDesc(!isEditingLocationDesc)}
              onSave={saveLocationDescription}
              isSaving={isSaving}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isEditingLocationDesc ? (
            <div className="space-y-2">
              <Textarea
                id="location_description"
                name="location_description"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="Describe the property location and surroundings"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                {formData.address ? 
                  "You can use the Generate button to create a description based on the property address." :
                  "Add a property address to use the auto-generate feature."}
              </p>
            </div>
          ) : (
            <div>
              {locationDescription ? (
                <p className="whitespace-pre-wrap">{locationDescription}</p>
              ) : (
                <p className="text-muted-foreground italic">No location description added yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Nearby Places</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFetchCategoryPlaces('restaurant')}
              disabled={isLoadingLocationData || !formData.address || isFetchingCategory}
            >
              Fetch Restaurants
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFetchCategoryPlaces('store')}
              disabled={isLoadingLocationData || !formData.address || isFetchingCategory}
            >
              Fetch Stores
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFetchCategoryPlaces('school')}
              disabled={isLoadingLocationData || !formData.address || isFetchingCategory}
            >
              Fetch Schools
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <NearbyPlaces 
            places={formData.nearby_places || []}
            cities={formData.nearby_cities || []}
            isDisabled={isLoadingLocationData || !formData.address}
            onSave={saveNearbyPlaces}
          />
          
          <div className="mt-4">
            <Label className="mb-2 block">Nearby Cities</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFetchCities}
              disabled={isLoadingLocationData || !formData.address || isFetchingCities}
              className="mt-2"
            >
              {isFetchingCities ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching Cities...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Fetch Nearby Cities
                </>
              )}
            </Button>
            
            {formData.nearby_cities && formData.nearby_cities.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.nearby_cities.map((city, index) => (
                  <Badge 
                    key={city.id || index} 
                    variant="secondary"
                  >
                    {city.name}
                    {city.distance && (
                      <span className="text-xs opacity-70 ml-1">
                        {typeof city.distance === 'number' 
                          ? `${city.distance.toFixed(1)} km` 
                          : city.distance}
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <SelectPlacesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        places={placesForModal}
        onSave={handleSavePlaces}
        category={currentCategory}
        isLoading={isFetchingCategory}
        maxSelections={5}
      />
      
      <SelectCitiesModal
        isOpen={citiesModalOpen}
        onClose={() => setCitiesModalOpen(false)}
        cities={citiesForModal}
        onSave={handleSaveCities}
        isLoading={isFetchingCities}
      />
    </div>
  );
}
