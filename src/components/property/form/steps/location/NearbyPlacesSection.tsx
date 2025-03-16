
import { useState } from "react";
import { PropertyFormData, PropertyNearbyPlace, PropertyPlaceType } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Plus, Search, X } from "lucide-react";
import { CategorySection } from "./components/CategorySection";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingLocationData: boolean;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function NearbyPlacesSection({
  formData,
  onFetchCategoryPlaces,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  onFieldChange
}: NearbyPlacesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch places based on category
  const handleFetchCategory = async (category: string) => {
    await onFetchCategoryPlaces(category);
  };

  // Function to add a custom place
  const handleAddCustomPlace = () => {
    if (!searchQuery.trim()) return;

    const newPlace: PropertyPlaceType = {
      id: crypto.randomUUID(),
      name: searchQuery,
      type: "other",
      types: ["other"],
      distance: 0,
      visible_in_webview: true
    };

    const updatedPlaces = [
      ...(formData.nearby_places || []),
      newPlace
    ];

    onFieldChange("nearby_places", updatedPlaces);
    setSearchQuery("");
  };

  // Function to remove a place
  const handleRemovePlace = (index: number) => {
    onRemoveNearbyPlace(index);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Nearby Places</h3>
      
      {/* Search and Add Custom Place */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Add custom place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="button" onClick={handleAddCustomPlace}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      
      {/* Categories for fetching places */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
        <CategorySection
          title="Restaurants"
          icon="restaurant"
          onClick={() => handleFetchCategory("restaurant")}
          isLoading={isLoadingLocationData}
        />
        <CategorySection
          title="Schools"
          icon="school"
          onClick={() => handleFetchCategory("school")}
          isLoading={isLoadingLocationData}
        />
        <CategorySection
          title="Parks"
          icon="park"
          onClick={() => handleFetchCategory("park")}
          isLoading={isLoadingLocationData}
        />
        <CategorySection
          title="Shops"
          icon="shop"
          onClick={() => handleFetchCategory("store")}
          isLoading={isLoadingLocationData}
        />
        <CategorySection
          title="Transit"
          icon="transit"
          onClick={() => handleFetchCategory("transit_station")}
          isLoading={isLoadingLocationData}
        />
        <CategorySection
          title="Health"
          icon="health"
          onClick={() => handleFetchCategory("hospital")}
          isLoading={isLoadingLocationData}
        />
      </div>
      
      {/* Places List */}
      <div className="mt-4">
        <Label>Selected Places</Label>
        <div className="mt-2 space-y-2">
          {(!formData.nearby_places || formData.nearby_places.length === 0) && (
            <p className="text-sm text-muted-foreground italic">No places selected yet</p>
          )}
          
          {formData.nearby_places?.map((place, index) => (
            <Card key={place.id} className="relative">
              <CardContent className="p-4 pl-8">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{place.name}</p>
                    <p className="text-xs text-muted-foreground">{place.vicinity}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePlace(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
