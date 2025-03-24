
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyNearbyPlace } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, Star } from "lucide-react";

export interface PlaceOption extends PropertyNearbyPlace {
  selected?: boolean;
}

interface SelectPlacesModalProps {
  open: boolean;
  onClose: () => void;
  places: PropertyNearbyPlace[];
  onSave: (selectedPlaces: PropertyNearbyPlace[]) => void;
}

export function SelectPlacesModal({ open, onClose, places, onSave }: SelectPlacesModalProps) {
  const [options, setOptions] = useState<PlaceOption[]>(
    places.map(place => ({ ...place, selected: false }))
  );
  
  // Group places by type
  const placesByType = options.reduce((acc: Record<string, PlaceOption[]>, place) => {
    const type = place.type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(place);
    return acc;
  }, {});
  
  const togglePlace = (id: string) => {
    setOptions(prev => 
      prev.map(place => 
        place.id === id ? { ...place, selected: !place.selected } : place
      )
    );
  };
  
  const handleSave = () => {
    const selectedPlaces = options.filter(place => place.selected);
    onSave(selectedPlaces);
  };
  
  const selectedCount = options.filter(place => place.selected).length;
  
  const handleSelectAll = (type: string, selected: boolean) => {
    setOptions(prev => 
      prev.map(place => 
        place.type === type ? { ...place, selected } : place
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Places</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select places to add to this property ({selectedCount} selected)
          </p>
          
          <div className="space-y-6">
            {Object.entries(placesByType).map(([type, typePlaces]) => (
              <div key={type} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium capitalize text-lg">{type.replace('_', ' ')}</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSelectAll(type, true)}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSelectAll(type, false)}
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {typePlaces.map((place) => (
                    <div 
                      key={place.id} 
                      className={`border p-3 rounded-md cursor-pointer transition-colors ${
                        place.selected ? 'bg-primary/10 border-primary' : ''
                      }`}
                      onClick={() => togglePlace(place.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={place.selected}
                          onCheckedChange={() => togglePlace(place.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="font-medium">{place.name}</div>
                          
                          {place.vicinity && (
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {place.vicinity}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-1">
                            {place.rating && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {place.rating}
                              </Badge>
                            )}
                            
                            {place.distance && (
                              <Badge variant="outline" className="text-xs">
                                {typeof place.distance === 'number' 
                                  ? `${place.distance.toFixed(1)} km` 
                                  : place.distance}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {place.selected && (
                          <Check className="h-5 w-5 text-primary shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={selectedCount === 0}>
            Add {selectedCount} {selectedCount === 1 ? 'Place' : 'Places'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
