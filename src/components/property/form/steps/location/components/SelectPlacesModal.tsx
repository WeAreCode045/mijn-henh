
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PropertyNearbyPlace } from "@/types/property";

// Define a type that's compatible with PropertyNearbyPlace but has optional distance
export type PlaceOption = Omit<PropertyNearbyPlace, 'distance'> & { 
  distance?: string | number 
};

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
  places,
  onSave,
  category,
  isLoading = false,
  maxSelections = 5
}: SelectPlacesModalProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceOption[]>([]);

  const handleTogglePlace = (place: PlaceOption, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPlaces(prev => [...prev, place]);
    } else {
      setSelectedPlaces(prev => prev.filter(p => p.id !== place.id));
    }
  };

  const handleSave = () => {
    onSave(selectedPlaces);
    setSelectedPlaces([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedPlaces([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Select {category} Places
            {maxSelections && <span className="text-sm font-normal ml-2">(Select up to {maxSelections})</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : places.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {places.map((place) => (
                <div key={place.id} className="flex items-start space-x-3 p-2 rounded border">
                  <Checkbox 
                    id={`place-${place.id}`}
                    checked={selectedPlaces.some(p => p.id === place.id)}
                    onCheckedChange={(checked) => {
                      handleTogglePlace(place, checked === true);
                    }}
                    disabled={selectedPlaces.length >= maxSelections && !selectedPlaces.some(p => p.id === place.id)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`place-${place.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {place.name}
                    </label>
                    {place.vicinity && (
                      <p className="text-xs text-gray-500">{place.vicinity}</p>
                    )}
                    <div className="flex items-center mt-1 space-x-2">
                      {place.distance !== undefined && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {typeof place.distance === 'number' 
                            ? `${place.distance.toFixed(1)} km` 
                            : place.distance}
                        </span>
                      )}
                      {place.rating !== undefined && place.rating > 0 && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                          ★ {place.rating.toFixed(1)} ({place.user_ratings_total})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No places found in this category</p>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={selectedPlaces.length === 0}
          >
            Add {selectedPlaces.length} place{selectedPlaces.length !== 1 && 's'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
