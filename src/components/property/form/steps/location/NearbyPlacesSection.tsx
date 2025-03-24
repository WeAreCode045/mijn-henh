
import React, { useState } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NearbyPlacesList } from "./components/NearbyPlacesList";
import { NearbyPlacesSearch } from "./components/NearbyPlacesSearch";
import { Loader2 } from "lucide-react";

export interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
  onRemoveNearbyPlace?: (index: number) => void;
}

export function NearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchCategoryPlaces,
  isLoadingNearbyPlaces = false,
  onRemoveNearbyPlace
}: NearbyPlacesSectionProps) {
  const [activeTab, setActiveTab] = useState("view");
  
  const handleRemovePlace = (index: number) => {
    if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
      return;
    }
    
    if (!formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.filter((_, i) => i !== index);
    onFieldChange('nearby_places', updatedPlaces);
  };
  
  const fetchPlaces = async (category: string) => {
    if (!onFetchCategoryPlaces) return;
    
    try {
      // Prevent default button behavior
      return await onFetchCategoryPlaces(category);
    } catch (error) {
      console.error("Error fetching places:", error);
      return null;
    }
  };

  // Function to handle search button click
  const handleSearchClick = async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    
    if (onFetchCategoryPlaces) {
      await fetchPlaces(category);
    }
  };

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
            {isLoadingNearbyPlaces ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading places...</span>
              </div>
            ) : (
              <NearbyPlacesList 
                places={formData.nearby_places || []} 
                onRemove={handleRemovePlace}
              />
            )}
          </TabsContent>
          
          <TabsContent value="search">
            <NearbyPlacesSearch 
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchPlaces={fetchPlaces}
              isLoading={isLoadingNearbyPlaces}
              onSearchClick={handleSearchClick} // Pass the handler to prevent default
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
