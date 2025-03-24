
import React, { useState } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlacesSearchTab } from "./PlacesSearchTab";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useNearbyPlaces } from "@/hooks/location/useNearbyPlaces";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingNearbyPlaces?: boolean;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

export function NearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchCategoryPlaces,
  onRemoveNearbyPlace,
  isLoadingNearbyPlaces = false,
  onSearchClick
}: NearbyPlacesSectionProps) {
  const [activeTab, setActiveTab] = useState("view");
  const [selectedPlaces, setSelectedPlaces] = useState<PropertyNearbyPlace[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Use our hook if custom props aren't provided
  const {
    fetchPlaces: hookFetchPlaces,
    removePlaceAtIndex: hookRemovePlaceAtIndex,
    saveSelectedPlaces,
    searchResults,
    isLoading: hookIsLoading
  } = onFieldChange ? useNearbyPlaces(formData, onFieldChange) : { 
    fetchPlaces: null, 
    removePlaceAtIndex: null,
    saveSelectedPlaces: null,
    searchResults: [],
    isLoading: false 
  };

  // Use either the provided functions or the hook's functions
  const fetchPlaces = onFetchCategoryPlaces || hookFetchPlaces;
  const removePlaceAtIndex = onRemoveNearbyPlace || hookRemovePlaceAtIndex;
  const isLoading = isLoadingNearbyPlaces || hookIsLoading;

  const handlePlaceClick = (place: PropertyNearbyPlace) => {
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p.id === place.id);
      return isSelected 
        ? prev.filter(p => p.id !== place.id) 
        : [...prev, place];
    });
  };

  const handleSaveSelectedPlaces = () => {
    if (saveSelectedPlaces) {
      saveSelectedPlaces(selectedPlaces);
      setShowResultsModal(false);
      setSelectedPlaces([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Places</TabsTrigger>
            <TabsTrigger value="add">Add Places</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="pt-4">
            {formData.nearby_places?.length ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {formData.nearby_places.map((place, index) => (
                    <div key={place.id} className="border rounded-md p-3 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{place.name}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{place.vicinity || "No address available"}</span>
                          </div>

                          <div className="flex items-center space-x-2 mt-1">
                            {place.rating && (
                              <div className="flex items-center">
                                <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                                <span className="text-sm">
                                  {place.rating} ({place.user_ratings_total || 0})
                                </span>
                              </div>
                            )}
                            
                            <Badge variant="outline">{place.type}</Badge>
                          </div>
                        </div>
                        
                        {removePlaceAtIndex && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePlaceAtIndex(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center">
                <p className="text-muted-foreground">No nearby places added yet.</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => setActiveTab("add")}
                >
                  Add places
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add" className="pt-4">
            <PlacesSearchTab
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchPlaces={fetchPlaces}
              isLoading={isLoading}
              onSearchClick={onSearchClick}
            />
          </TabsContent>
        </Tabs>

        {/* Results Selection Modal */}
        <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Places to Add</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-2">
                {searchResults.map((place) => (
                  <div 
                    key={place.id} 
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedPlaces.some(p => p.id === place.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{place.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{place.vicinity || "No address available"}</span>
                        </div>
                        {place.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                            <span className="text-sm">
                              {place.rating} ({place.user_ratings_total || 0} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowResultsModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveSelectedPlaces}
                disabled={selectedPlaces.length === 0}
              >
                Add {selectedPlaces.length} Selected
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
