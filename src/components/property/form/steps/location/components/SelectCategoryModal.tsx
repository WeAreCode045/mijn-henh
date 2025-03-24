
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Category definitions with their included types
const categoryConfig = {
  "Food & Drinks": ["restaurant", "bar", "cafe"],
  "Nightlife & Entertainment": ["casino", "concert_hall", "event_venue", "night_club", "movie_theater"],
  "Education": ["school", "university", "library", "preschool", "primary_school", "secondary_school"],
  "Sports": ["gym", "arena", "fitness_center", "golf_course", "ski_resort", "sports_club", "sports_complex", "stadium", "swimming_pool"],
  "Shopping": ["supermarket", "shopping_mall"]
};

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
  isLoading?: boolean;
}

export function SelectCategoryModal({
  isOpen,
  onClose,
  onSelect,
  isLoading = false
}: SelectCategoryModalProps) {
  const handleCategoryClick = (categoryName: string) => {
    // Get all types for this category
    const types = categoryConfig[categoryName as keyof typeof categoryConfig];
    console.log(`Searching for category: ${categoryName} with types:`, types);
    
    // For API, we'll use the first type as the category identifier, but pass all types
    if (types && types.length > 0) {
      onSelect(categoryName);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Category to Search</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-3 py-4">
          {Object.keys(categoryConfig).map((category) => (
            <Button
              key={category}
              variant="outline"
              className="justify-start text-left h-auto py-3"
              disabled={isLoading}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
