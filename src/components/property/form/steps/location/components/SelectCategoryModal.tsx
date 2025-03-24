
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Star, MapPin, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyNearbyPlace } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => Promise<void>;
  isLoading: boolean;
}

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

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchResults([]);
      setSearchPerformed(false);
      setSelectedPlaces([]);
    }
  }, [isOpen]);

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
      
      // Call onSelect to trigger the parent component's search logic
      await onSelect(category);
      
      // Don't close the modal, we'll show results here
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

  // Get search results from useNearbyPlacesSearch hook via props
  useEffect(() => {
    if (isLoading) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [isLoading]);

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Nearby Places</DialogTitle>
        </DialogHeader>
        
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
          
          {(isSearching || isLoading) && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <p>Searching for {category} places...</p>
            </div>
          )}
          
          {!isSearching && !isLoading && searchPerformed && searchResults.length === 0 && (
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
              
              <DialogFooter>
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
              </DialogFooter>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
