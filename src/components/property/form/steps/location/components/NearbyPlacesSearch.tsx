
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface NearbyPlacesSearchProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchPlaces: (category: string) => Promise<any>;
  isLoading: boolean;
  onSearchClick: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<void>;
}

export function NearbyPlacesSearch({
  formData,
  onFieldChange,
  onFetchPlaces,
  isLoading,
  onSearchClick
}: NearbyPlacesSearchProps) {
  const [selectedCategory, setSelectedCategory] = useState("restaurant");
  
  const categories = [
    { id: "restaurant", label: "Restaurants" },
    { id: "cafe", label: "Cafés" },
    { id: "bar", label: "Bars" },
    { id: "supermarket", label: "Supermarkets" },
    { id: "school", label: "Schools" },
    { id: "hospital", label: "Hospitals" },
    { id: "pharmacy", label: "Pharmacies" },
    { id: "park", label: "Parks" },
    { id: "gym", label: "Gyms" },
    { id: "transit_station", label: "Transit Stations" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex-grow-0"
          >
            {category.label}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={(e) => onSearchClick(e, selectedCategory)}
          disabled={isLoading || !formData.latitude || !formData.longitude}
          type="button" 
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search {selectedCategory === "all" ? "All Places" : categories.find(c => c.id === selectedCategory)?.label || selectedCategory}
            </>
          )}
        </Button>
      </div>
      
      {(!formData.latitude || !formData.longitude) && (
        <div className="text-center p-4 bg-muted rounded-md">
          <p className="text-muted-foreground">
            Please enter an address to enable place search
          </p>
        </div>
      )}
    </div>
  );
}
