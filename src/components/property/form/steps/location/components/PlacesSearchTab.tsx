
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  School, 
  Coffee, 
  ShoppingBag, 
  Train, 
  Hospital, 
  MapPin, 
  Dumbbell
} from "lucide-react";

interface PlacesSearchTabProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchPlaces: (category: string) => Promise<any>;
  isLoading: boolean;
  onSearchClick: (e: React.MouseEvent<HTMLButtonElement>, category: string) => void;
}

export function PlacesSearchTab({
  formData,
  onFieldChange,
  onFetchPlaces,
  isLoading,
  onSearchClick
}: PlacesSearchTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Category definitions
  const categories = [
    { id: "education", name: "Education", icon: School, description: "Schools, universities and educational institutions" },
    { id: "entertainment", name: "Entertainment", icon: Coffee, description: "Restaurants, cafes, bars and entertainment venues" },
    { id: "shopping", name: "Shopping", icon: ShoppingBag, description: "Supermarkets, shopping centers and retail" },
    { id: "transportation", name: "Transportation", icon: Train, description: "Train stations, bus stops and transit" },
    { id: "healthcare", name: "Healthcare", icon: Hospital, description: "Hospitals, clinics and healthcare providers" },
    { id: "sports", name: "Sports", icon: Dumbbell, description: "Gyms, sports facilities and recreation" },
    { id: "all", name: "All Places", icon: MapPin, description: "Search for all types of places nearby" }
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Search for places near this property by category. Results will be shown in a selection dialog.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
            onSearch={(e) => {
              // Prevent event propagation to avoid the card click handler
              e.stopPropagation();
              // Call the search handler with the category
              onSearchClick(e, category.id);
            }}
            isLoading={isLoading && selectedCategory === category.id}
            disabled={!formData.latitude || !formData.longitude}
          />
        ))}
      </div>
      
      {(!formData.latitude || !formData.longitude) && (
        <div className="text-center p-4 bg-muted rounded-md mt-4">
          <p className="text-muted-foreground">
            Please ensure the property has coordinates (latitude/longitude) to enable place search.
          </p>
        </div>
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: React.FC<any>;
    description: string;
  };
  isSelected: boolean;
  onClick: () => void;
  onSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  disabled?: boolean;
}

function CategoryCard({ 
  category, 
  isSelected, 
  onClick, 
  onSearch, 
  isLoading,
  disabled = false
}: CategoryCardProps) {
  const Icon = category.icon;
  
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-primary ring-1 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col items-start">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-medium">{category.name}</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || disabled}
            onClick={onSearch}
            className="ml-auto"
            type="button"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
      </CardContent>
    </Card>
  );
}
