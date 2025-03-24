
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SearchPlacesTabProps {
  onSearch?: (category: string) => Promise<any>;
  isLoading?: boolean;
  coordinates?: {
    latitude: number | null;
    longitude: number | null;
  };
  propertyId?: string;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

const categoryOptions = [
  { id: "restaurant", label: "Restaurants" },
  { id: "school", label: "Schools" },
  { id: "park", label: "Parks" },
  { id: "shopping_mall", label: "Shopping" },
  { id: "supermarket", label: "Supermarkets" },
  { id: "hospital", label: "Hospitals" },
  { id: "transit_station", label: "Public Transport" },
  { id: "Food & Drinks", label: "Food & Drinks" },
  { id: "Nightlife & Entertainment", label: "Nightlife & Entertainment" },
  { id: "Education", label: "Education" },
  { id: "Sports", label: "Sports" },
  { id: "Shopping", label: "Shopping" }
];

export function SearchPlacesTab({
  onSearch,
  isLoading = false,
  coordinates,
  propertyId,
  onSearchClick
}: SearchPlacesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    
    if (onSearchClick) {
      await onSearchClick(e, selectedCategory);
    } else if (onSearch) {
      await onSearch(selectedCategory);
    }
  };

  const hasCoordinates = coordinates?.latitude && coordinates?.longitude;

  if (!hasCoordinates) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Property coordinates are required to search for nearby places. Please set the address first and save the property.
        </AlertDescription>
      </Alert>
    );
  }

  if (!propertyId) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to save the property before searching for nearby places.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search Nearby Places</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categoryOptions.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryClick(category.id)}
              className="justify-start"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSearch}
          disabled={!selectedCategory || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">◌</span>
              Searching...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              {selectedCategory ? `Find ${selectedCategory}` : "Select a category"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
