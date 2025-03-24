
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";
import { PlacesSearchTab } from "./PlacesSearchTab";
import { PlacesViewTab } from "./PlacesViewTab";
import { useState, useEffect } from "react";
import { useNearbyPlaces } from "@/hooks/location/useNearbyPlaces";

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
  const [searchResults, setSearchResults] = useState<Record<string, any>>({});
  const [showModal, setShowModal] = useState(false);
  
  // Log key props for debugging
  useEffect(() => {
    console.log("NearbyPlacesSection props & state:", {
      hasSearchClick: !!onSearchClick,
      hasFormData: !!formData,
      hasFetchCategoryPlaces: !!onFetchCategoryPlaces,
      searchResultsCount: Object.keys(searchResults).length,
      showModal,
      latitude: formData.latitude,
      longitude: formData.longitude,
      nearbyPlacesCount: formData.nearby_places?.length || 0
    });
  }, [
    formData,
    onSearchClick,
    onFetchCategoryPlaces,
    searchResults,
    showModal
  ]);
  
  // Use our fixed hook if onFetchCategoryPlaces wasn't provided
  const nearbyPlacesHook = useNearbyPlaces(
    formData,
    onFieldChange || (() => {})
  );
  
  const handleFetchPlaces = async (category: string) => {
    console.log(`handleFetchPlaces called for category: ${category}`);
    
    if (onFetchCategoryPlaces) {
      console.log(`Using parent component's onFetchCategoryPlaces for ${category}`);
      const results = await onFetchCategoryPlaces(category);
      console.log(`Results from onFetchCategoryPlaces for ${category}:`, results);
      
      if (results) {
        setSearchResults(results);
        setActiveTab("view");
      }
      return results;
    } else {
      console.log(`Using local nearbyPlacesHook.fetchPlaces for ${category}`);
      const results = await nearbyPlacesHook.fetchPlaces(category);
      console.log(`Results from nearbyPlacesHook.fetchPlaces for ${category}:`, results);
      
      if (results) {
        setSearchResults(results);
        setActiveTab("view");
      }
      return results;
    }
  };
  
  const handleRemovePlace = (index: number) => {
    console.log(`Removing place at index: ${index}`);
    
    if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
    } else {
      nearbyPlacesHook.removePlaceAtIndex(index);
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
              isLoading={isLoadingNearbyPlaces || nearbyPlacesHook.isLoading}
              onSearchClick={onSearchClick}
            />
          </TabsContent>
          
          <TabsContent value="view">
            <PlacesViewTab 
              places={formData.nearby_places || []}
              onRemovePlace={handleRemovePlace}
              isLoading={isLoadingNearbyPlaces || nearbyPlacesHook.isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
