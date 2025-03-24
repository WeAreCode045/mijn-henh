import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => Promise<any>;
  isLoading?: boolean;
}

export function SelectCategoryModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  isLoading = false 
}: SelectCategoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = [
    { id: "restaurant", name: "Restaurants", icon: "🍽️" },
    { id: "cafe", name: "Cafes", icon: "☕" },
    { id: "bar", name: "Bars", icon: "🍻" },
    { id: "supermarket", name: "Supermarkets", icon: "🛒" },
    { id: "school", name: "Schools", icon: "🏫" },
    { id: "park", name: "Parks", icon: "🌳" },
    { id: "gym", name: "Gyms", icon: "💪" },
    { id: "hospital", name: "Hospitals", icon: "🏥" },
    { id: "pharmacy", name: "Pharmacies", icon: "💊" },
    { id: "bank", name: "Banks", icon: "🏦" },
    { id: "shopping_mall", name: "Shopping Centers", icon: "🛍️" },
    { id: "subway_station", name: "Metro Stations", icon: "🚇" },
    { id: "train_station", name: "Train Stations", icon: "🚆" },
    { id: "bus_station", name: "Bus Stations", icon: "🚌" },
    { id: "airport", name: "Airports", icon: "✈️" }
  ];

  const handleSelectCategory = async (category: string) => {
    if (isLoading || isProcessing) return;
    
    setSelectedCategory(category);
    setIsProcessing(true);
    
    try {
      console.log(`Starting API request for category: ${category}`);
      const result = await onSelect(category);
      console.log(`API request completed for ${category}:`, result);
      
      // Only close the modal if we got results or if explicitly handling empty results
      if (result && (Object.keys(result).length > 0 || result[category]?.length > 0)) {
        onClose();
      } else {
        console.log(`No results found for category: ${category}`);
        // Keep modal open if no results
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(`Error fetching places for category ${category}:`, error);
      setIsProcessing(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    // Only allow closing if not processing a request
    if (!open && !isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Category</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Choose a category to find places near this property
          </p>
          
          {isLoading || isProcessing ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              {selectedCategory && <p className="ml-2">Loading {selectedCategory} places...</p>}
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left"
                    onClick={() => handleSelectCategory(category.id)}
                  >
                    <span className="mr-2 text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
