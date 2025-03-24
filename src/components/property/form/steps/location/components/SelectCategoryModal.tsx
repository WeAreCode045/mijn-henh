
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Star, MapPin, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyNearbyPlace } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => Promise<void>;
  isLoading: boolean;
}

// Define the predefined search options groups
const searchCategoryGroups = [
  {
    name: "Food & Drinks",
    types: ["restaurant", "bar", "cafe"],
  },
  {
    name: "Nightlife & Entertainment",
    types: ["casino", "concert_hall", "event_venue", "night_club", "movie_theater"],
  },
  {
    name: "Education",
    types: ["school", "university", "library", "preschool", "primary_school", "secondary_school"],
  },
  {
    name: "Sports",
    types: ["gym", "arena", "fitness_center", "golf_course", "sports_club", "sports_complex", "stadium", "swimming_pool"],
  },
  {
    name: "Shopping",
    types: ["supermarket", "shopping_mall"],
  },
];

export function SelectCategoryModal({
  isOpen,
  onClose,
  onSelect,
  isLoading
}: SelectCategoryModalProps) {
  const [category, setCategory] = useState("");
  const [searchResults, setSearchResults] = useState<PropertyNearbyPlace[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<PropertyNearbyPlace[]>([]);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("custom");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category to search",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setSearchPerformed(true);
    
    try {
      // Get Google Maps API key from settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (settingsError) {
        console.error("Error fetching API key from settings:", settingsError);
        throw new Error("Could not fetch Google Maps API key from settings");
      }
      
      const apiKey = settingsData?.google_maps_api_key;
      
      if (!apiKey) {
        toast({
          title: "Missing API Key",
          description: "Please set a Google Maps API key in your agency settings",
          variant: "destructive"
        });
        setIsSearching(false);
        return;
      }
      
      // Call onSelect to get the latitude and longitude from the parent component
      await onSelect(category);
      
      // For now, we'll just close the modal since the actual search is handled by onSelect
      // We'll implement the actual search in a later step
    } catch (error) {
      console.error("Error searching places:", error);
      toast({
        title: "Error",
        description: "Failed to search for places",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePredefinedCategoryClick = async (categoryType: string) => {
    setCategory(categoryType);
    
    try {
      setIsSearching(true);
      await onSelect(categoryType);
    } catch (error) {
      console.error("Error with predefined category search:", error);
      toast({
        title: "Error",
        description: `Failed to search for ${categoryType} places`,
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const togglePlaceSelection = (place: PropertyNearbyPlace) => {
    setSelectedPlaces(prev => {
      const isAlreadySelected = prev.some(p => p.id === place.id);
      if (isAlreadySelected) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const isPlaceSelected = (placeId: string) => {
    return selectedPlaces.some(place => place.id === placeId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Nearby Places</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="custom" value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="custom">Custom Search</TabsTrigger>
            <TabsTrigger value="predefined">Predefined Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="flex-1 overflow-hidden flex flex-col">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter place category (e.g., restaurant, cafe, school)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSearching || isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isSearching || isLoading || !category.trim()} 
                  size="sm"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {isSearching && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <p>Searching for {category} places...</p>
                </div>
              )}
              
              {!isSearching && searchPerformed && searchResults.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No places found for this category. Try another category or check your location settings.
                </p>
              )}
              
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {searchResults.map((place) => (
                      <div 
                        key={place.id} 
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          isPlaceSelected(place.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                        }`}
                        onClick={() => togglePlaceSelection(place)}
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
                          
                          <div className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                            isPlaceSelected(place.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                          }`}>
                            {isPlaceSelected(place.id) && <Check className="h-4 w-4" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      disabled={selectedPlaces.length === 0}
                      onClick={() => {
                        // In a real implementation, we would save the selected places here
                        toast({
                          title: "Success",
                          description: `Selected ${selectedPlaces.length} places`
                        });
                        onClose();
                      }}
                    >
                      Add {selectedPlaces.length} Selected
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </TabsContent>

          <TabsContent value="predefined" className="flex-1 overflow-auto">
            <div className="space-y-6">
              {searchCategoryGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <h3 className="font-semibold text-sm">{group.name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.types.map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        disabled={isSearching || isLoading}
                        onClick={() => handlePredefinedCategoryClick(type)}
                      >
                        {type.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {isSearching && (
              <div className="flex items-center justify-center py-4 mt-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <p>Searching for places...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
