
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { CategorySection } from "./components/CategorySection";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { SelectPlacesModal, PlaceOption } from "./components/SelectPlacesModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemovePlace?: (index: number) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchNearbyPlaces?: (category?: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
}

export function NearbyPlacesSection({ 
  formData,
  onRemovePlace,
  onFieldChange,
  onFetchNearbyPlaces,
  isLoadingNearbyPlaces = false
}: NearbyPlacesSectionProps) {
  const nearbyPlaces = formData.nearby_places || [];
  const [activeTab, setActiveTab] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [placesForModal, setPlacesForModal] = useState<PlaceOption[]>([]);
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);
  const [selectedPlacesToDelete, setSelectedPlacesToDelete] = useState<number[]>([]);
  const { toast } = useToast();
  
  // Define our categories
  const categories = [
    { id: "restaurant", label: "Restaurants" },
    { id: "education", label: "Education" },
    { id: "supermarket", label: "Supermarkets" },
    { id: "shopping", label: "Shopping" },
    { id: "sport", label: "Sport Facilities" },
    { id: "leisure", label: "Leisure" }
  ];
  
  // Group places by category
  const placesByCategory: Record<string, PropertyNearbyPlace[]> = {
    all: [...nearbyPlaces]
  };
  
  // Add places to their respective categories
  nearbyPlaces.forEach((place) => {
    const category = place.type || 'other';
    if (!placesByCategory[category]) {
      placesByCategory[category] = [];
    }
    placesByCategory[category].push(place);
  });
  
  // Handle fetch for specific category
  const handleFetchCategory = async (category: string) => {
    if (!onFetchNearbyPlaces) return;
    
    setIsFetchingCategory(true);
    setCurrentCategory(category);
    
    try {
      const results = await onFetchNearbyPlaces(category);
      if (results && results[category]) {
        // Convert to our format
        const options: PlaceOption[] = results[category].map((place: any) => ({
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          distance: place.distance,
          type: category
        }));
        
        setPlacesForModal(options);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setIsFetchingCategory(false);
    }
  };
  
  // Handle saving selected places
  const handleSavePlaces = (selectedPlaces: PlaceOption[]) => {
    if (!onFieldChange || !formData.nearby_places) return;
    
    // Convert to PropertyNearbyPlace
    const newPlaces: PropertyNearbyPlace[] = selectedPlaces.map(place => ({
      id: place.id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      distance: place.distance || 0,
      type: place.type,
      visible_in_webview: true
    }));
    
    // Filter out existing places with the same IDs
    const existingPlaces = formData.nearby_places.filter(
      place => !newPlaces.some(newPlace => newPlace.id === place.id)
    );
    
    // Merge existing places with new ones
    const updatedPlaces = [...existingPlaces, ...newPlaces];
    onFieldChange('nearby_places', updatedPlaces);
  };
  
  const togglePlaceVisibility = (placeIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.map((place, idx) => 
      idx === placeIndex ? { ...place, visible_in_webview: visible } : place
    );
    
    onFieldChange('nearby_places', updatedPlaces);
  };

  const togglePlaceSelection = (placeIndex: number, selected: boolean) => {
    if (selected) {
      setSelectedPlacesToDelete([...selectedPlacesToDelete, placeIndex]);
    } else {
      setSelectedPlacesToDelete(selectedPlacesToDelete.filter(idx => idx !== placeIndex));
    }
  };

  const handleBulkDelete = () => {
    if (!onFieldChange || !formData.nearby_places || selectedPlacesToDelete.length === 0) return;

    // Filter out the places that are selected for deletion
    const updatedPlaces = formData.nearby_places.filter((_, idx) => 
      !selectedPlacesToDelete.includes(idx)
    );
    
    // Update the form data
    onFieldChange('nearby_places', updatedPlaces);
    
    // Reset selection
    setSelectedPlacesToDelete([]);
    
    // Show success toast
    toast({
      title: "Places removed",
      description: `${selectedPlacesToDelete.length} places have been removed.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Nearby Places</h3>
        
        {onFetchNearbyPlaces && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onFetchNearbyPlaces();
            }}
            disabled={isLoadingNearbyPlaces || !formData.address}
            className="flex gap-2 items-center"
          >
            {isLoadingNearbyPlaces ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Fetching...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                Get All Nearby Places
              </>
            )}
          </Button>
        )}
      </div>
      
      {nearbyPlaces.length > 0 ? (
        <div className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All ({nearbyPlaces.length})</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label} ({placesByCategory[category.id]?.length || 0})
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex justify-between mt-2">
              {activeTab !== 'all' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleFetchCategory(activeTab)}
                  disabled={isFetchingCategory}
                >
                  {isFetchingCategory ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Fetch {categories.find(c => c.id === activeTab)?.label}
                    </>
                  )}
                </Button>
              )}
              
              {selectedPlacesToDelete.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDelete}
                  className="ml-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedPlacesToDelete.length})
                </Button>
              )}
            </div>
            
            <TabsContent value="all" className="space-y-4 mt-4">
              {nearbyPlaces.length > 0 ? (
                <CategorySection
                  key="all-places"
                  category="All Places"
                  places={nearbyPlaces}
                  onRemovePlace={onRemovePlace}
                  toggleVisibility={togglePlaceVisibility}
                  toggleSelection={togglePlaceSelection}
                  selectedIndices={selectedPlacesToDelete}
                  isVisible={(place) => !!place.visible_in_webview}
                  selectionMode={true}
                />
              ) : (
                <p className="text-center py-4 text-muted-foreground">No places found</p>
              )}
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                {placesByCategory[category.id]?.length > 0 ? (
                  <CategorySection
                    key={category.id}
                    category={category.label}
                    places={placesByCategory[category.id] || []}
                    onRemovePlace={onRemovePlace}
                    toggleVisibility={togglePlaceVisibility}
                    toggleSelection={togglePlaceSelection}
                    selectedIndices={selectedPlacesToDelete}
                    isVisible={(place) => !!place.visible_in_webview}
                    selectionMode={true}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <Alert variant="default" className="bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription>
                          No {category.label.toLowerCase()} found near this property. Use the "Fetch" button above to search for places in this category.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            No nearby places found. Try fetching location data to discover places near this property.
          </p>
        </div>
      )}
      
      {/* Modal for selecting places */}
      <SelectPlacesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        places={placesForModal}
        onSave={handleSavePlaces}
        category={currentCategory}
        isLoading={isFetchingCategory}
      />
    </div>
  );
}
