
import { useState, useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/hooks/use-toast";
import { usePlaceSearchResults } from "./usePlaceSearchResults";
import { usePlaceSaving } from "./usePlaceSaving";
import { usePlaceRemoval } from "./usePlaceRemoval";

export function useNearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchCategoryPlaces,
  onRemoveNearbyPlace,
  onSearchClick
}: {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onRemoveNearbyPlace?: (index: number) => void;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}) {
  const [activeTab, setActiveTab] = useState("view");
  const toast = useToast();
  
  // Extract search results functionality to a separate hook
  const {
    searchResults,
    setSearchResults,
    showSelectionModal,
    setShowSelectionModal,
    fetchPlaces,
    handleSearchClick
  } = usePlaceSearchResults({
    formData,
    onFetchCategoryPlaces,
    onSearchClick,
    toast
  });
  
  // Extract place saving functionality to a separate hook
  const { handleSavePlaces } = usePlaceSaving({
    formData,
    onFieldChange,
    toast,
    setShowSelectionModal,
    setSearchResults
  });
  
  // Extract place removal functionality to a separate hook
  const { handleRemovePlace } = usePlaceRemoval({
    formData,
    onFieldChange,
    onRemoveNearbyPlace,
    toast
  });

  return {
    activeTab,
    setActiveTab,
    searchResults,
    setSearchResults,
    showSelectionModal,
    setShowSelectionModal,
    fetchPlaces,
    handleSearchClick,
    handleSavePlaces,
    handleRemovePlace
  };
}
