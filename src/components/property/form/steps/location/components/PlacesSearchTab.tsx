
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { SelectCategoryModal } from "./SelectCategoryModal";
import { useCategories } from "../hooks/useCategories";

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
  const [showModal, setShowModal] = useState(false);
  const { categories } = useCategories();

  const handleOpenModal = () => {
    if (!formData.latitude || !formData.longitude) {
      console.error("Cannot open modal: missing coordinates");
      return;
    }
    setShowModal(true);
  };

  const handleCategorySelect = async (category: string) => {
    console.log("Selected category:", category);
    
    if (onSearchClick) {
      console.log("Using provided search handler for category:", category);
      // Use the parent component's click handler
      const dummyEvent = { preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent<HTMLButtonElement>;
      await onSearchClick(dummyEvent, category);
    } else if (onFetchPlaces) {
      console.log("Using provided fetch handler for category:", category);
      // Use the provided fetch handler directly
      await onFetchPlaces(category);
    } else {
      console.error("No fetch handler provided for category:", category);
    }
    
    // Close the modal regardless of the result
    setShowModal(false);
  };

  const hasCoordinates = !!(formData.latitude && formData.longitude);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Find and add places of interest near this property.
      </p>
      
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={handleOpenModal}
          disabled={isLoading || !hasCoordinates}
        >
          {isLoading ? "Loading..." : "Find Places"}
        </Button>
      </div>
      
      {!hasCoordinates && (
        <p className="text-sm text-destructive text-center">
          Please enter property coordinates before searching for nearby places.
        </p>
      )}
      
      <SelectCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleCategorySelect}
        isLoading={isLoading}
      />
    </div>
  );
}
