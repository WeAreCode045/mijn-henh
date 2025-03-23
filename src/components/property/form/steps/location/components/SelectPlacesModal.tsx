
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

export interface PlaceOption {
  id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  distance?: number;
  type: string;
  types?: string[];
  maxSelections?: number;
}

interface SelectPlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: PlaceOption[];
  onSave: (selectedPlaces: PlaceOption[]) => void;
  category: string;
  isLoading?: boolean;
  maxSelections?: number;
}

export function SelectPlacesModal({
  isOpen,
  onClose,
  places = [],
  onSave,
  category,
  isLoading = false,
  maxSelections = 5
}: SelectPlacesModalProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceOption[]>([]);
  
  // Get the effective max selections (from first place if available, or prop)
  const effectiveMaxSelections = places[0]?.maxSelections || maxSelections;

  // Reset selections when modal is opened with new places
  useEffect(() => {
    if (isOpen && places.length > 0) {
      setSelectedPlaces([]);
    }
  }, [isOpen, places]);

  const handleTogglePlace = (place: PlaceOption) => {
    if (selectedPlaces.some(p => p.id === place.id)) {
      setSelectedPlaces(selectedPlaces.filter(p => p.id !== place.id));
    } else {
      // Count how many places of this type are already selected
      const selectedOfThisType = selectedPlaces.filter(p => p.type === place.type).length;
      
      // Only allow selection if we haven't reached the max for this type
      if (selectedOfThisType < effectiveMaxSelections) {
        setSelectedPlaces([...selectedPlaces, place]);
      }
    }
  };

  const handleSave = () => {
    onSave(selectedPlaces);
    onClose();
  };

  const formatCategory = (cat: string) => {
    return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select {formatCategory(category)}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select up to {effectiveMaxSelections} places per type (found {places.length} places).
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : places.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No places found for this category</p>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {places.map((place) => {
                  // Count how many places of this type are already selected
                  const selectedOfThisType = selectedPlaces.filter(p => p.type === place.type).length;
                  const isDisabled = !selectedPlaces.some(p => p.id === place.id) && 
                                     selectedOfThisType >= effectiveMaxSelections;
                  
                  return (
                    <div 
                      key={place.id} 
                      className="flex items-start p-3 rounded-md border bg-white"
                    >
                      <Checkbox 
                        id={`place-${place.id}`}
                        className="mt-1"
                        checked={selectedPlaces.some(p => p.id === place.id)}
                        onCheckedChange={() => handleTogglePlace(place)}
                        disabled={isDisabled}
                      />
                      <div className="ml-3 space-y-1 flex-1">
                        <label 
                          htmlFor={`place-${place.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {place.name}
                        </label>
                        
                        {place.vicinity && (
                          <p className="text-sm text-gray-500">{place.vicinity}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mt-1">
                          {place.distance !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              {typeof place.distance === 'number' 
                                ? `${place.distance.toFixed(1)} km` 
                                : place.distance}
                            </Badge>
                          )}
                          
                          {place.rating && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {place.rating.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={selectedPlaces.length === 0}
          >
            Save {selectedPlaces.length} places
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
