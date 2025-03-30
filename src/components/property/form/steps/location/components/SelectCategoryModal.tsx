
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, MapPin, Book, Coffee, Film, Building, ShoppingBag, Dumbbell } from "lucide-react";

interface CategoryOption {
  name: string;
  icon: React.ReactNode;
  description: string;
}

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
  const categories: CategoryOption[] = [
    {
      name: "Food & Drinks",
      icon: <Coffee className="h-8 w-8" />,
      description: "Restaurants, cafes, bars and more"
    },
    {
      name: "Nightlife & Entertainment",
      icon: <Film className="h-8 w-8" />,
      description: "Movie theaters, night clubs, event venues"
    },
    {
      name: "Education",
      icon: <Book className="h-8 w-8" />,
      description: "Schools, universities, libraries"
    },
    {
      name: "Sports",
      icon: <Dumbbell className="h-8 w-8" />,
      description: "Gyms, sports complexes, swimming pools"
    },
    {
      name: "Shopping",
      icon: <ShoppingBag className="h-8 w-8" />,
      description: "Supermarkets, shopping malls"
    }
  ];

  const handleSelect = (category: string) => {
    if (isLoading) return;
    console.log(`Category selected: ${category}`);
    onSelect(category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Category</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleSelect(category.name)}
              className={`
                p-4 border rounded-lg flex flex-col items-center text-center gap-2 cursor-pointer 
                transition-all duration-200 hover:bg-slate-50
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                category.icon
              )}
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
