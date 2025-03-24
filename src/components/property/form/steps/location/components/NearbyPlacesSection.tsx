
import { useState } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlacesViewTab } from "./PlacesViewTab";
import { PlacesSearchTab } from "./PlacesSearchTab";
import { SelectPlacesModal } from "./SelectPlacesModal";
import { useNearbyPlacesSection } from "../hooks/useNearbyPlacesSection";

export interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
  onRemoveNearbyPlace?: (index: number) => void;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => void;
}

export function NearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchCategoryPlaces,
  isLoadingNearbyPlaces = false,
  onRemoveNearbyPlace,
  onSearchClick
}: NearbyPlacesSectionProps) {
  const {
    activeTab,
    setActiveTab,
    searchResults,
    setSearchResults,
    showSelectionModal,
    setShowSelectionModal,
    fetchPlaces,
    handleSearchClick,
    handleSavePlaces,
    handleRemovePlace
  } = useNearbyPlacesSection({
    formData,
    onFieldChange,
    onFetchCategoryPlaces,
    onRemoveNearbyPlace,
    onSearchClick
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="view">View Places</TabsTrigger>
            <TabsTrigger value="search">Find Places</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            <PlacesViewTab 
              formData={formData}
              isLoading={isLoadingNearbyPlaces}
              onRemovePlace={handleRemovePlace}
            />
          </TabsContent>
          
          <TabsContent value="search">
            <PlacesSearchTab 
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchPlaces={fetchPlaces}
              isLoading={isLoadingNearbyPlaces}
              onSearchClick={handleSearchClick}
            />
          </TabsContent>
        </Tabs>
        
        {/* Modal for selecting places */}
        {showSelectionModal && (
          <SelectPlacesModal
            open={showSelectionModal}
            onClose={() => {
              setShowSelectionModal(false);
              setSearchResults([]);
            }}
            places={searchResults}
            onSave={handleSavePlaces}
          />
        )}
      </CardContent>
    </Card>
  );
}
