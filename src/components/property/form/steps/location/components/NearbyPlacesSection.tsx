
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
      longitude: formData.longitude
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
    if (onFetchCategoryPlaces) {
      const results = await onFetchCategoryPlaces(category);
      if (results) {
        setSearchResults(results);
        setActiveTab("view");
      }
      return results;
    } else {
      const results = await nearbyPlacesHook.fetchPlaces(category);
      if (results) {
        setSearchResults(results);
        setActiveTab("view");
      }
      return results;
    }
  };
  
  const handleRemovePlace = (index: number) => {
    if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
    } else {
      nearbyPlacesHook.removePlaceAtIndex(index);
    }
  };

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
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
