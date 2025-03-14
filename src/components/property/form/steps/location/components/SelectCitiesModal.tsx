
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { PropertyCity } from "@/types/property";

interface SelectCitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: PropertyCity[];
  onSave: (selectedCities: PropertyCity[]) => void;
  isLoading?: boolean;
  maxSelections?: number;
}

export function SelectCitiesModal({
  isOpen,
  onClose,
  cities = [],
  onSave,
  isLoading = false,
  maxSelections = 5
}: SelectCitiesModalProps) {
  const [selectedCities, setSelectedCities] = useState<PropertyCity[]>([]);

  const handleToggleCity = (city: PropertyCity) => {
    if (selectedCities.some(c => c.id === city.id)) {
      setSelectedCities(selectedCities.filter(c => c.id !== city.id));
    } else {
      if (selectedCities.length < maxSelections) {
        setSelectedCities([...selectedCities, city]);
      }
    }
  };

  const handleSave = () => {
    onSave(selectedCities);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Nearby Cities</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select up to {maxSelections} cities to include (found {cities.length} cities).
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : cities.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No nearby cities found</p>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {cities.map((city) => (
                  <div 
                    key={city.id} 
                    className="flex items-start p-3 rounded-md border bg-white"
                  >
                    <Checkbox 
                      id={`city-${city.id}`}
                      className="mt-1"
                      checked={selectedCities.some(c => c.id === city.id)}
                      onCheckedChange={() => handleToggleCity(city)}
                      disabled={!selectedCities.some(c => c.id === city.id) && selectedCities.length >= maxSelections}
                    />
                    <div className="ml-3 space-y-1 flex-1">
                      <label 
                        htmlFor={`city-${city.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {city.name}
                      </label>
                      
                      <div className="flex flex-wrap gap-2 mt-1">
                        {city.distance !== undefined && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {typeof city.distance === 'number' 
                              ? `${city.distance.toFixed(1)} km` 
                              : city.distance}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={selectedCities.length === 0}
          >
            Save {selectedCities.length} cities
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
