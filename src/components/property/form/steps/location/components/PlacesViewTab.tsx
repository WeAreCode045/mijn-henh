
import React, { useState } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PlacesList } from "./PlacesList";
import { groupPlacesByCategory } from "../utils/placeUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlacesViewTabProps {
  places: PropertyNearbyPlace[];
  onRemove?: (index: number) => void;
  onToggleVisibility?: (index: number, visible: boolean) => void;
  isDisabled?: boolean;
}

export function PlacesViewTab({ 
  places, 
  onRemove, 
  onToggleVisibility,
  isDisabled 
}: PlacesViewTabProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Group the places by category
  const placesByCategory = React.useMemo(() => {
    return groupPlacesByCategory(places);
  }, [places]);

  // Create a list of unique categories from the places
  const categories = Object.keys(placesByCategory);
  
  // Get unique actual categories for tab creation (not the formatted ones)
  const uniqueRawCategories = React.useMemo(() => {
    const categorySet = new Set<string>();
    places.forEach(place => {
      if (place.category) {
        categorySet.add(place.category);
      }
    });
    return Array.from(categorySet);
  }, [places]);

  if (places.length === 0) {
    return (
      <Alert variant="default" className="bg-gray-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No places have been saved to this property. Use the "Search" tab to find and save nearby places.
        </AlertDescription>
      </Alert>
    );
  }

  // Sort categories alphabetically
  const sortedCategories = [...categories].sort();
  const sortedRawCategories = [...uniqueRawCategories].sort();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="all">All Places ({places.length})</TabsTrigger>
        {sortedRawCategories.map(category => {
          const placesInCategory = places.filter(place => place.category === category);
          return (
            <TabsTrigger key={category} value={category}>
              {category} ({placesInCategory.length})
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      <TabsContent value="all">
        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="text-lg font-semibold">{category}</h3>
              <PlacesList
                places={placesByCategory[category]}
                onRemove={onRemove}
                onToggleVisibility={onToggleVisibility}
                isDisabled={isDisabled}
              />
            </div>
          ))}
        </div>
      </TabsContent>
      
      {sortedRawCategories.map(rawCategory => {
        // Filter places for this category
        const placesInCategory = places.filter(place => place.category === rawCategory);
        
        // Group these filtered places by their display category
        const groupedPlacesInCategory = groupPlacesByCategory(placesInCategory);
        const displayCategories = Object.keys(groupedPlacesInCategory).sort();
        
        return (
          <TabsContent key={rawCategory} value={rawCategory}>
            <div className="space-y-6">
              {displayCategories.map((displayCategory) => (
                <div key={displayCategory} className="space-y-2">
                  <h3 className="text-lg font-semibold">{displayCategory}</h3>
                  <PlacesList
                    places={groupedPlacesInCategory[displayCategory]}
                    onRemove={onRemove}
                    onToggleVisibility={onToggleVisibility}
                    isDisabled={isDisabled}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
