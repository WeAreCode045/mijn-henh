
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NearbyPlacesSearchProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchPlaces?: (category: string) => Promise<any>;
  isLoading?: boolean;
}

export function NearbyPlacesSearch({
  formData,
  onFieldChange,
  onFetchPlaces,
  isLoading = false
}: NearbyPlacesSearchProps) {
  const [selectedCategory, setSelectedCategory] = useState("restaurant");
  const [activeTab, setActiveTab] = useState("categories");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  const categories = [
    { value: "restaurant", label: "Restaurants" },
    { value: "cafe", label: "Cafes" },
    { value: "bar", label: "Bars" },
    { value: "supermarket", label: "Supermarkets" },
    { value: "school", label: "Schools" },
    { value: "hospital", label: "Hospitals" },
    { value: "park", label: "Parks" },
    { value: "gym", label: "Gyms" },
    { value: "shopping_mall", label: "Shopping Malls" },
    { value: "gas_station", label: "Gas Stations" },
  ];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSearch = async () => {
    if (!onFetchPlaces || !selectedCategory) return;
    
    setIsSearching(true);
    try {
      const results = await onFetchPlaces(selectedCategory);
      if (results) {
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Error searching places:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const togglePlaceSelection = (placeId: string) => {
    setSelectedPlaces(prev => {
      if (prev.includes(placeId)) {
        return prev.filter(id => id !== placeId);
      } else {
        return [...prev, placeId];
      }
    });
  };

  const addSelectedPlaces = () => {
    // Find selected places in search results
    const placesToAdd = searchResults.filter(place => selectedPlaces.includes(place.id));

    // Combine with existing places
    const existingPlaces = formData.nearby_places || [];
    const updatedPlaces = [...existingPlaces, ...placesToAdd];
    
    // Update form data
    onFieldChange('nearby_places', updatedPlaces);
    
    // Reset selection
    setSelectedPlaces([]);
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="custom">Custom Search</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || isLoading}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              placeholder="Custom search term..." 
              className="flex-1"
              disabled={true}
            />
            <Button 
              disabled={true}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Custom search is not implemented yet.</p>
        </TabsContent>
      </Tabs>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Search Results</h3>
            <Button 
              size="sm" 
              onClick={addSelectedPlaces} 
              disabled={selectedPlaces.length === 0}
            >
              Add Selected ({selectedPlaces.length})
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map(place => (
              <Card 
                key={place.id}
                className={`cursor-pointer transition-colors ${
                  selectedPlaces.includes(place.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => togglePlaceSelection(place.id)}
              >
                <CardContent className="p-3">
                  <div>
                    <h4 className="font-medium">{place.name}</h4>
                    <p className="text-sm text-muted-foreground">{place.vicinity}</p>
                    {place.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm">{place.rating} ({place.user_ratings_total || 0})</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
