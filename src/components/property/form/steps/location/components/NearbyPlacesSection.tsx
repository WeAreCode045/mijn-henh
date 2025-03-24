
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";
import { PlacesSearchTab } from "./PlacesSearchTab";
import { PlacesViewTab } from "./PlacesViewTab";
import { useState, useEffect } from "react";
import { useNearbyPlaces } from "@/hooks/location/useNearbyPlaces";
import { useToast } from "@/components/ui/use-toast";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
  onRemoveNearbyPlace?: (index: number) => void;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

export function NearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchCategoryPlaces,
  isLoadingNearbyPlaces = false,
  onRemoveNearbyPlace,
  onSearchClick
}: NearbyPlacesSectionProps) {
  const [activeTab, setActiveTab] = useState("search");
  const { toast } = useToast(); // Import toast directly from useToast hook
  
  // Log key props for debugging
  useEffect(() => {
    console.log("NearbyPlacesSection props & state:", {
      hasSearchClick: !!onSearchClick,
      hasFormData: !!formData,
      hasFetchCategoryPlaces: !!onFetchCategoryPlaces,
      searchResultsCount: 0,
      showModal: false,
      latitude: formData.latitude,
      longitude: formData.longitude,
      nearbyPlacesCount: formData.nearby_places?.length || 0
    });
  }, [
    formData,
    onSearchClick,
    onFetchCategoryPlaces
  ]);

  // Use the hook's fetch function if onFetchCategoryPlaces wasn't provided
  const { fetchPlaces, removePlaceAtIndex, isLoading: hookIsLoading } = useNearbyPlaces(
    formData,
    onFieldChange || (() => {})
  );
  
  const handleFetchPlaces = async (category: string) => {
    console.log(`handleFetchPlaces called for category: ${category}`);
    
    // Validate that we have a property ID before attempting to fetch
    if (!formData.id) {
      console.error("Cannot fetch places: Missing property ID");
      toast({
        title: "Error",
        description: "Cannot fetch places: Missing property ID",
        variant: "destructive"
      });
      return null;
    }
    
    // Try to use the provided fetch function or fall back to the hook's function
    if (onFetchCategoryPlaces) {
      console.log(`Using parent component's onFetchCategoryPlaces for ${category}`);
      return await onFetchCategoryPlaces(category);
    } else {
      console.log(`Using local hook's fetchPlaces for ${category}`);
      return await fetchPlaces(category);
    }
  };
  
  const handleRemovePlace = (index: number) => {
    if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
    } else {
      removePlaceAtIndex(index);
    }
  };

  // Check if we have nearby places to determine which tab to show by default
  useEffect(() => {
    if (formData.nearby_places && formData.nearby_places.length > 0) {
      setActiveTab("view");
    }
  }, [formData.nearby_places]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger 
              value="view" 
              disabled={!formData.nearby_places || formData.nearby_places.length === 0}
            >
              View Places ({formData.nearby_places?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <PlacesSearchTab 
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchPlaces={handleFetchPlaces} 
              isLoading={isLoadingNearbyPlaces || hookIsLoading}
              onSearchClick={onSearchClick}
            />
          </TabsContent>
          
          <TabsContent value="view">
            <PlacesViewTab 
              places={formData.nearby_places || []}
              onRemovePlace={handleRemovePlace}
              isLoading={isLoadingNearbyPlaces || hookIsLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
