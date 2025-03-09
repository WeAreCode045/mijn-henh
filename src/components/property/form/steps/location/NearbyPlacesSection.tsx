
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CategoryFilters } from "./components/CategoryFilters";
import { CategorySection } from "./components/CategorySection";
import { useLocationCategories } from "./useLocationCategories";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemovePlace?: (index: number) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
}

export function NearbyPlacesSection({
  formData,
  onRemovePlace,
  onFieldChange
}: NearbyPlacesSectionProps) {
  const { categories, handleFilterChange, activeFilters } = useLocationCategories(
    formData.nearby_places || []
  );
  
  // Toggle place visibility in webview
  const togglePlaceVisibility = (placeIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces[placeIndex] = {
      ...updatedPlaces[placeIndex],
      visible_in_webview: visible
    };
    
    onFieldChange('nearby_places', updatedPlaces);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label>Nearby Places</Label>
          
          {(formData.nearby_places && formData.nearby_places.length > 0) ? (
            <>
              <CategoryFilters 
                categories={categories}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
              
              {categories.map(category => (
                <CategorySection 
                  key={category.name}
                  category={category}
                  places={formData.nearby_places?.filter(place => place.type === category.name) || []}
                  onRemovePlace={onRemovePlace}
                  toggleVisibility={togglePlaceVisibility}
                  isVisible={activeFilters.includes(category.name)}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No nearby places found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Use the "Fetch Location Data" button in the Address section to get nearby places.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
