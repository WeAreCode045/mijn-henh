
import { useState, useEffect } from "react";
import { PropertyNearbyPlace } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface PlaceOption extends PropertyNearbyPlace {
  selected?: boolean;
}

interface SelectPlacesModalProps {
  open: boolean;
  onClose: () => void;
  places: PlaceOption[];
  onSave: (selectedPlaces: PlaceOption[]) => void;
}

export function SelectPlacesModal({ open, onClose, places, onSave }: SelectPlacesModalProps) {
  const [placesWithSelection, setPlacesWithSelection] = useState<PlaceOption[]>([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "distance">("rating");

  // Initialize places with selection state
  useEffect(() => {
    setPlacesWithSelection(
      places.map(place => ({
        ...place,
        selected: true // Default to selected
      }))
    );
  }, [places]);

  // Get selected places
  const selectedPlaces = placesWithSelection.filter(place => place.selected);
  
  // Handle save
  const handleSave = () => {
    onSave(selectedPlaces);
  };

  // Handle toggle all
  const toggleAll = (checked: boolean) => {
    setPlacesWithSelection(prevPlaces => 
      prevPlaces.map(place => ({
        ...place,
        selected: checked
      }))
    );
  };

  // Handle toggle individual place
  const togglePlace = (id: string, checked: boolean) => {
    setPlacesWithSelection(prevPlaces =>
      prevPlaces.map(place => 
        place.id === id ? { ...place, selected: checked } : place
      )
    );
  };

  // Sorted and filtered places
  const filteredPlaces = placesWithSelection
    .filter(place => 
      place.name.toLowerCase().includes(filter.toLowerCase()) ||
      place.type.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") {
        // Sort by rating (highest first)
        return (b.rating || 0) - (a.rating || 0);
      } else {
        // Sort by distance (closest first)
        const distA = typeof a.distance === "number" ? a.distance : 9999;
        const distB = typeof b.distance === "number" ? b.distance : 9999;
        return distA - distB;
      }
    });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Places to Add</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 rounded-md bg-muted mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              {selectedPlaces.length} of {placesWithSelection.length} places selected
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleAll(true)}
                className="h-8"
              >
                Select All
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleAll(false)}
                className="h-8"
              >
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Filter places..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {filter && (
                <button 
                  onClick={() => setFilter("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-sm whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "distance")}
                className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-2">
            {filteredPlaces.map((place) => (
              <div 
                key={place.id}
                className="flex items-start space-x-3 border rounded-md p-3 hover:bg-accent/10"
              >
                <Checkbox 
                  id={place.id}
                  checked={place.selected}
                  onCheckedChange={(checked) => togglePlace(place.id, checked as boolean)}
                />
                <div className="flex-1">
                  <label 
                    htmlFor={place.id}
                    className="font-medium text-sm flex items-center cursor-pointer"
                  >
                    {place.name}
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted">
                      {place.type}
                    </span>
                  </label>
                  
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {place.vicinity && <span className="mr-3">{place.vicinity}</span>}
                    
                    {place.rating !== undefined && place.rating !== null && (
                      <span className="flex items-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {place.rating}
                      </span>
                    )}
                    
                    {place.distance && (
                      <span>
                        {typeof place.distance === 'number' 
                          ? `${place.distance.toFixed(1)} km` 
                          : place.distance}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPlaces.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No places match your filter. Try adjusting your search.
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={selectedPlaces.length === 0}
          >
            Add {selectedPlaces.length} Places
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
