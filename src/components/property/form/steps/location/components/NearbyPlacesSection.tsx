
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { SearchPlacesTab } from "./SearchPlacesTab";
import { PlacesViewTab } from "./PlacesViewTab";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { preparePropertiesForJsonField } from "@/hooks/property-form/preparePropertyData";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemoveNearbyPlace?: (index: number) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

export function NearbyPlacesSection({
  formData,
  onRemoveNearbyPlace,
  onFieldChange,
  onFetchCategoryPlaces,
  isLoadingNearbyPlaces,
  onSearchClick
}: NearbyPlacesSectionProps) {
  const [activeTab, setActiveTab] = useState<"view" | "search">("view");
  const { toast } = useToast();
  
  const nearbyPlaces = formData.nearby_places || [];
  
  const handleToggleVisibility = useCallback(async (index: number, visible: boolean) => {
    if (!onFieldChange || !formData.id || !formData.nearby_places) return;
    
    try {
      // Create a copy of the places array
      const updatedPlaces = [...formData.nearby_places];
      
      // Update the visibility of the place at the specified index
      updatedPlaces[index] = {
        ...updatedPlaces[index],
        visible_in_webview: visible
      };
      
      // Update form state
      onFieldChange('nearby_places', updatedPlaces);
      
      // Update in Supabase
      const jsonPlaces = preparePropertiesForJsonField(updatedPlaces);
      const { error } = await supabase
        .from('properties')
        .update({ nearby_places: jsonPlaces })
        .eq('id', formData.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        description: `Place will ${visible ? 'be shown' : 'not be shown'} in the property webview`,
      });
    } catch (error) {
      console.error("Error toggling place visibility:", error);
      toast({
        variant: "destructive",
        description: "Failed to update place visibility",
      });
    }
  }, [formData.id, formData.nearby_places, onFieldChange, toast]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "view" | "search")}>
          <TabsList>
            <TabsTrigger value="view">View Places</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4 pt-4">
            <PlacesViewTab 
              places={nearbyPlaces}
              onRemove={onRemoveNearbyPlace}
              onToggleVisibility={handleToggleVisibility}
              isDisabled={!formData.id}
            />
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4 pt-4">
            <SearchPlacesTab 
              onSearch={onFetchCategoryPlaces}
              isLoading={isLoadingNearbyPlaces}
              coordinates={{ 
                latitude: formData.latitude, 
                longitude: formData.longitude 
              }}
              propertyId={formData.id}
              onSearchClick={onSearchClick}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
