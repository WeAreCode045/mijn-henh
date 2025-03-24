import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyFormData } from "@/types/property";
import { SelectCategoryModal } from "./SelectCategoryModal";
import { useNearbyPlacesSearch } from "@/hooks/location/useNearbyPlacesSearch";

interface PlacesSearchTabProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchPlaces?: (category: string) => Promise<any>;
  isLoading?: boolean;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

export function PlacesSearchTab({
  formData,
  onFieldChange,
  onFetchPlaces,
  isLoading = false,
  onSearchClick
}: PlacesSearchTabProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Use our hook for searching
  const {
    searchPlaces,
    isSearching: hookIsSearching,
    results: searchResults,
    setResults
  } = useNearbyPlacesSearch({
    latitude: formData.latitude,
    longitude: formData.longitude
  });

  // Merge the loading states
  const isSearching = isLoading || hookIsSearching;

  const handleCategorySearch = async (category: string) => {
    if (onSearchClick) {
      // If we have a custom search click handler, use it
      const result = await onSearchClick({} as React.MouseEvent<HTMLButtonElement>, category);
      if (result && result[category]) {
        setResults(result[category]);
      }
    } else if (onFetchPlaces) {
      // If we have a fetch places handler, use it
      const result = await onFetchPlaces(category);
      if (result && result[category]) {
        setResults(result[category]);
      }
    } else {
      // Otherwise, use our hook's search function
      const results = await searchPlaces(category);
      // Results are automatically set in the hook
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={() => setIsCategoryModalOpen(true)}
          disabled={isSearching}
          className="w-full md:w-auto"
        >
          {isSearching ? "Searching..." : "Find Places Nearby"}
        </Button>
      </div>
      
      <SelectCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={handleCategorySearch}
        isLoading={isSearching}
      />
    </div>
  );
}
