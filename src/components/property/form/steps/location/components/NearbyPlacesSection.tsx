
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlacesSearchTab } from "./PlacesSearchTab";
import { PlacesViewTab } from "./PlacesViewTab";
import { useState, useEffect } from "react";
import { useNearbyPlacesSection } from "../hooks/useNearbyPlacesSection";
import { getCategoriesWithCounts } from "../utils/placeUtils";
import { CategoryFilters } from "./CategoryFilters";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onRemoveNearbyPlace?: (index: number) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

export function NearbyPlacesSection({
  formData,
  onFieldChange,
  onRemoveNearbyPlace,
  onFetchCategoryPlaces,
  isLoadingNearbyPlaces = false,
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
    onFieldChange: onFieldChange || (() => {}),
    onFetchCategoryPlaces,
    onRemoveNearbyPlace,
    onSearchClick
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PropertyNearbyPlace[]>(formData.nearby_places || []);
  
  // Get categories with counts for the filter
  const categories = getCategoriesWithCounts(formData.nearby_places || []);
  
  // Update filtered places when formData changes or filters change
  useEffect(() => {
    if (!formData.nearby_places || formData.nearby_places.length === 0) {
      setFilteredPlaces([]);
      return;
    }
    
    if (activeFilters.length === 0) {
      setFilteredPlaces(formData.nearby_places);
      return;
    }
    
    const filtered = formData.nearby_places.filter(place => {
      const category = place.category || place.type || 'Other';
      return activeFilters.includes(category);
    });
    
    setFilteredPlaces(filtered);
  }, [formData.nearby_places, activeFilters]);
  
  const handleFilterChange = (category: string) => {
    setActiveFilters(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="view">View Places</TabsTrigger>
            <TabsTrigger value="search">Search Places</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            {/* Category filters */}
            {categories.length > 0 && (
              <CategoryFilters 
                categories={categories} 
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            )}
            
            <PlacesViewTab
              places={filteredPlaces}
              onRemove={handleRemovePlace}
            />
          </TabsContent>
          
          <TabsContent value="search">
            <PlacesSearchTab 
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchPlaces={onFetchCategoryPlaces}
              isLoading={isLoadingNearbyPlaces}
              onSearchClick={handleSearchClick}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
