
import React, { useState } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NearbyPlacesList } from "./components/NearbyPlacesList";
import { NearbyPlacesSearch } from "./components/NearbyPlacesSearch";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SelectPlacesModal } from "./components/SelectPlacesModal";

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
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<PropertyNearbyPlace[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  
  const handleRemovePlace = (index: number) => {
    if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
      return;
    }
    
    if (!formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.filter((_, i) => i !== index);
    onFieldChange('nearby_places', updatedPlaces);
    
    toast({
      title: "Removed",
      description: "Nearby place removed successfully",
    });
  };
  
  const fetchPlaces = async (category: string) => {
    if (!onFetchCategoryPlaces) return;
    
    try {
      console.log("Fetching places for category:", category);
      const result = await onFetchCategoryPlaces(category);
      
      if (result) {
        console.log("Search results:", result);
        // Flatten results if it's an object with category keys
        let places: PropertyNearbyPlace[] = [];
        if (typeof result === 'object' && !Array.isArray(result)) {
          // If result is an object with category keys, flatten all places
          Object.values(result).forEach(categoryPlaces => {
            if (Array.isArray(categoryPlaces)) {
              places = [...places, ...categoryPlaces as PropertyNearbyPlace[]];
            }
          });
        } else if (Array.isArray(result)) {
          places = result;
        }
        
        // Only show results if we have places to show
        if (places.length > 0) {
          console.log("Places to display in modal:", places.length);
          setSearchResults(places);
          setShowSelectionModal(true);
          
          toast({
            title: "Success",
            description: `Found ${places.length} nearby places`,
          });
        } else {
          toast({
            title: "Info",
            description: "No nearby places found in this category",
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error fetching places:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby places",
        variant: "destructive",
      });
      return null;
    }
  };

  // Function to handle search button click
  const handleSearchClick = async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    console.log("Search handler called for category:", category);
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    
    if (onFetchCategoryPlaces) {
      await fetchPlaces(category);
    }
  };
  
  // Function to save selected places to the property
  const handleSavePlaces = (selectedPlaces: PropertyNearbyPlace[]) => {
    // Filter out duplicates based on place ID
    const existingIds = new Set((formData.nearby_places || []).map(place => place.id));
    const newPlaces = selectedPlaces.filter(place => !existingIds.has(place.id));
    
    // Combine existing and new places
    const updatedPlaces = [
      ...(formData.nearby_places || []),
      ...newPlaces
    ];
    
    // Update form data
    onFieldChange('nearby_places', updatedPlaces);
    
    // Close modal and clear results
    setShowSelectionModal(false);
    setSearchResults([]);
    
    // Show toast
    toast({
      title: "Success",
      description: `Added ${newPlaces.length} places to the property`,
    });
  };

  // Group places by type for the view tab
  const placesByType = React.useMemo(() => {
    if (!formData.nearby_places || formData.nearby_places.length === 0) return {};
    
    return formData.nearby_places.reduce((acc: Record<string, PropertyNearbyPlace[]>, place) => {
      const type = place.type || 'other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(place);
      return acc;
    }, {});
  }, [formData.nearby_places]);

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
              <div className="space-y-4">
                {Object.keys(placesByType).length > 0 ? (
                  Object.entries(placesByType).map(([type, places]) => (
                    <div key={type} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 capitalize">{type.replace('_', ' ')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {places.map((place, idx) => {
                          // Find the original index in the full array
                          const globalIndex = formData.nearby_places?.findIndex(p => p.id === place.id) ?? -1;
                          return (
                            <div key={place.id || idx} className="bg-muted p-3 rounded-md relative group">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium">{place.name}</h5>
                                  {place.vicinity && (
                                    <p className="text-sm text-muted-foreground">{place.vicinity}</p>
                                  )}
                                  {place.rating && (
                                    <p className="text-yellow-500 text-sm">★ {place.rating}</p>
                                  )}
                                  {place.distance && (
                                    <p className="text-sm text-muted-foreground">
                                      Distance: {typeof place.distance === 'number' 
                                        ? `${place.distance.toFixed(1)} km` 
                                        : place.distance}
                                    </p>
                                  )}
                                </div>
                                {globalIndex >= 0 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 absolute top-2 right-2"
                                    onClick={() => handleRemovePlace(globalIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No nearby places found. Use the "Find Places" tab to search for places near this property.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="search">
            <NearbyPlacesSearch 
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
