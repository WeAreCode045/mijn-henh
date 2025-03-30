
import { useState, useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

export function usePlaceSearchResults({
  formData,
  onFetchCategoryPlaces,
  onSearchClick,
  toast
}: {
  formData: PropertyFormData;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
  toast: ReturnType<typeof useToast>;
}) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const fetchPlaces = useCallback(
    async (category: string) => {
      if (!formData.latitude || !formData.longitude) {
        toast.toast({
          title: "Missing location",
          description: "Please set the property location first",
          variant: "destructive",
        });
        return;
      }

      try {
        let results;

        if (onFetchCategoryPlaces) {
          results = await onFetchCategoryPlaces(category);
        } else {
          // Default implementation if no custom fetch function is provided
          setTimeout(() => {
            toast.toast({
              title: "No fetch function",
              description: "No fetch function provided for places",
              variant: "destructive",
            });
          }, 0);
          return;
        }

        if (results && results.length > 0) {
          setSearchResults(results);
          setShowSelectionModal(true);
        } else {
          toast.toast({
            title: "No places found",
            description: "No places found for this category",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching places:", error);
        toast.toast({
          title: "Error fetching places",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    },
    [formData.latitude, formData.longitude, onFetchCategoryPlaces, toast]
  );

  const handleSearchClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
      e.preventDefault();
      
      if (!formData.latitude || !formData.longitude) {
        toast.toast({
          title: "Missing location",
          description: "Please set the property location first",
          variant: "destructive",
        });
        return;
      }
      
      try {
        let results;
        
        if (onSearchClick) {
          results = await onSearchClick(e, category);
        } else {
          results = await fetchPlaces(category);
        }
        
        if (results && results.length > 0) {
          setSearchResults(results);
          setShowSelectionModal(true);
        } else if (results === undefined) {
          // Do nothing, this means the fetch function is handling the UI
        } else {
          toast.toast({
            title: "No places found",
            description: "No places found for the selected category",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error with search click:", error);
        toast.toast({
          title: "Error searching for places",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    },
    [formData.latitude, formData.longitude, onSearchClick, fetchPlaces, toast]
  );

  return {
    searchResults,
    setSearchResults,
    showSelectionModal,
    setShowSelectionModal,
    fetchPlaces,
    handleSearchClick,
  };
}
