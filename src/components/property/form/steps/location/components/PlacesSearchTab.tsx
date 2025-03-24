
import { Button } from "@/components/ui/button";
import { PropertyFormData } from "@/types/property";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";
import { SelectCategoryModal } from "./SelectCategoryModal";
import { SearchIcon, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const categoriesData = useCategories();
  const [selectCategoryOpen, setSelectCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Now correctly accessing the categories property from the hook's return value
  const categories = categoriesData.categories;
  
  const handleCategorySelect = async (category: string) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
    setSelectCategoryOpen(false);
    
    if (!formData.latitude || !formData.longitude) {
      setError("Property coordinates are required. Please set coordinates first.");
      return;
    }
    
    // Clear any previous errors
    setError(null);
    setSearching(true);
    
    try {
      if (onSearchClick) {
        console.log("Using provided search handler for category:", category);
        await onSearchClick(new MouseEvent('click') as any, category);
      } else if (onFetchPlaces) {
        console.log("Using default fetch handler for category:", category);
        await onFetchPlaces(category);
      } else {
        console.warn("No search or fetch handler provided");
      }
    } catch (e) {
      console.error("Error searching for places:", e);
      setError("Failed to fetch places. Please try again.");
    } finally {
      setSearching(false);
    }
  };
  
  const handleSearchButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      setError("Property coordinates are required. Please set coordinates first.");
      return;
    }
    
    setSelectCategoryOpen(true);
  };

  const isDisabled = isLoading || searching || !formData.latitude || !formData.longitude;

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid place-items-center py-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Search for nearby places by category to enhance the property listing with
            local amenities and points of interest.
          </p>
          
          <Button
            size="lg"
            className="gap-2"
            onClick={handleSearchButtonClick}
            disabled={isDisabled}
            type="button"
          >
            {isLoading || searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
            {isLoading || searching ? "Searching..." : "Search Nearby Places"}
          </Button>
          
          {!formData.latitude || !formData.longitude ? (
            <p className="text-sm text-yellow-600">
              Property coordinates are required. Please set coordinates first.
            </p>
          ) : null}
        </div>
      </div>

      <SelectCategoryModal
        isOpen={selectCategoryOpen}
        onClose={() => setSelectCategoryOpen(false)}
        onSelect={handleCategorySelect}
      />
    </div>
  );
}
