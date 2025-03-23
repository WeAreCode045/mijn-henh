
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface City {
  id: string;
  name: string;
  distance?: number;
}

interface SelectCitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
  onSave: (selectedCities: City[]) => void;
  isLoading?: boolean;
}

export function SelectCitiesModal({
  isOpen,
  onClose,
  cities = [],
  onSave,
  isLoading = false
}: SelectCitiesModalProps) {
  const [selectedCities, setSelectedCities] = useState<City[]>([]);

  // Reset selections when modal is opened with new cities
  useEffect(() => {
    if (isOpen && cities.length > 0) {
      setSelectedCities([]);
    }
  }, [isOpen, cities]);

  const handleToggleCity = (city: City) => {
    if (selectedCities.some(c => c.id === city.id)) {
      setSelectedCities(selectedCities.filter(c => c.id !== city.id));
    } else {
      setSelectedCities([...selectedCities, city]);
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
            Select cities to display as nearby to this property (found {cities.length} cities).
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : cities.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No cities found near this location</p>
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
                    />
                    <div className="ml-3 space-y-1 flex-1">
                      <label 
                        htmlFor={`city-${city.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {city.name}
                      </label>
                      
                      {city.distance !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {typeof city.distance === 'number' 
                            ? `${city.distance.toFixed(1)} km` 
                            : city.distance}
                        </Badge>
                      )}
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
