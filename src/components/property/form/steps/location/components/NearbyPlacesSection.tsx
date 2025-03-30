
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Search, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const PLACE_CATEGORIES = [
  { id: "restaurant", label: "Restaurants" },
  { id: "supermarket", label: "Supermarkets" },
  { id: "school", label: "Schools" },
  { id: "hospital", label: "Hospitals" },
  { id: "park", label: "Parks" },
  { id: "gym", label: "Gyms" },
  { id: "pharmacy", label: "Pharmacies" },
  { id: "train_station", label: "Train Stations" },
  { id: "bus_station", label: "Bus Stations" },
  { id: "shopping_mall", label: "Shopping Malls" }
];

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
  onRemoveNearbyPlace?: (index: number) => void;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

export function NearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchCategoryPlaces,
  isLoadingNearbyPlaces = false,
  onRemoveNearbyPlace,
  onSearchClick
}: NearbyPlacesSectionProps) {
  const [activeCategorySearch, setActiveCategorySearch] = useState<string | null>(null);
  
  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    e.preventDefault();
    
    if (onSearchClick) {
      setActiveCategorySearch(category);
      try {
        const results = await onSearchClick(e, category);
        setActiveCategorySearch(null);
        
        if (results && results[category] && onFieldChange) {
          // Merge new places with existing places, avoiding duplicates
          const existingPlaces = formData.nearby_places || [];
          const newPlaces = results[category];
          
          // Filter out duplicates by ID
          const existingIds = new Set(existingPlaces.map(place => place.id));
          const uniqueNewPlaces = newPlaces.filter(place => !existingIds.has(place.id));
          
          const updatedPlaces = [...existingPlaces, ...uniqueNewPlaces];
          onFieldChange('nearby_places', updatedPlaces);
        }
      } catch (error) {
        console.error(`Error searching for ${category}:`, error);
        setActiveCategorySearch(null);
      }
    } else if (onFetchCategoryPlaces) {
      setActiveCategorySearch(category);
      try {
        const results = await onFetchCategoryPlaces(category);
        setActiveCategorySearch(null);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setActiveCategorySearch(null);
      }
    }
  };

  const handleRemovePlace = (index: number) => {
    if (!onFieldChange) return;
    
    const updatedPlaces = [...(formData.nearby_places || [])];
    updatedPlaces.splice(index, 1);
    onFieldChange('nearby_places', updatedPlaces);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Category buttons */}
          <div className="flex flex-wrap gap-2">
            {PLACE_CATEGORIES.map(category => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={(e) => handleSearch(e, category.id)}
                disabled={isLoadingNearbyPlaces || activeCategorySearch === category.id}
                className="mb-2"
              >
                {activeCategorySearch === category.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {category.label}
                  </>
                )}
              </Button>
            ))}
          </div>
          
          {/* Table of nearby places */}
          {formData.nearby_places && formData.nearby_places.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.nearby_places.map((place, index) => (
                    <TableRow key={place.id}>
                      <TableCell className="font-medium">{place.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {place.type?.replace(/_/g, ' ') || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {place.rating ? (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{place.rating}</span>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {place.vicinity || 'No address'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemovePlace(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove place</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md bg-muted/20">
              <p className="text-sm text-muted-foreground">
                No nearby places added yet. Use the buttons above to search for places.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
