
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PropertyNearbyPlace } from "@/types/property";
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface PlaceOption extends PropertyNearbyPlace {
  maxSelections?: number;
  latitude?: number | null;
  longitude?: number | null;
}

interface SelectPlacesModalProps {
  open: boolean;
  onClose: () => void;
  places: PlaceOption[];
  onSave: (selectedPlaces: PlaceOption[]) => void;
}

export function SelectPlacesModal({
  open,
  onClose,
  places,
  onSave,
}: SelectPlacesModalProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceOption[]>([]);

  console.log("SelectPlacesModal rendered with places:", places.length);

  useEffect(() => {
    if (open) {
      setSelectedPlaces([]);
    }
  }, [open, places]);

  const handleTogglePlace = (place: PlaceOption) => {
    if (selectedPlaces.some((p) => p.id === place.id)) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleSave = () => {
    onSave(selectedPlaces);
  };

  const formatNumber = (value: string | number | undefined): string => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return String(value || '');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Nearby Places</DialogTitle>
        </DialogHeader>

        {places.length === 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No places found for this category. Try searching for a different category or check if 
              the property has valid coordinates.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {places.map((place) => {
                  // Generate a guaranteed unique ID for each place
                  const placeId = place.id || `place_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
                  
                  return (
                    <div
                      key={placeId}
                      className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={placeId}
                        checked={selectedPlaces.some((p) => p.id === place.id)}
                        onCheckedChange={() => handleTogglePlace(place)}
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor={placeId}
                          className="font-medium cursor-pointer text-sm"
                        >
                          {place.name}
                        </label>
                        <div className="text-xs text-muted-foreground">
                          <div>{place.vicinity}</div>
                          <div className="flex mt-1 gap-2">
                            {place.rating && (
                              <span className="bg-yellow-100 text-yellow-800 px-1.5 rounded-sm">
                                ★ {formatNumber(place.rating)}
                              </span>
                            )}
                            {place.distance && (
                              <span className="bg-blue-100 text-blue-800 px-1.5 rounded-sm">
                                {formatNumber(place.distance)} km
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <DialogFooter className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedPlaces.length} places selected
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={selectedPlaces.length === 0}
                >
                  Add Selected Places
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
