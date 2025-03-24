
import { useCallback, useState } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyLocationData(
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setPendingChanges: (pending: boolean) => void
) {
  const [isLoadingLocationData, setIsLoadingLocationData] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const { toast } = useToast();
  
  const onFetchLocationData = useCallback(async () => {
    if (!formState.address) return;
    
    setIsLoadingLocationData(true);
    
    try {
      // Mock implementation
      console.log("Fetching location data for address:", formState.address);
      
      setTimeout(() => {
        setIsLoadingLocationData(false);
        setPendingChanges(true);
      }, 1000);
    } catch (error) {
      console.error("Error fetching location data:", error);
      setIsLoadingLocationData(false);
    }
  }, [formState.address, setPendingChanges]);
  
  const onGenerateLocationDescription = useCallback(async () => {
    if (!formState.address) return;
    
    try {
      // Mock implementation
      console.log("Generating location description for address:", formState.address);
      setPendingChanges(true);
    } catch (error) {
      console.error("Error generating location description:", error);
    }
  }, [formState.address, setPendingChanges]);
  
  const onGenerateMap = useCallback(async () => {
    if (!formState.latitude || !formState.longitude) return;
    
    setIsGeneratingMap(true);
    
    try {
      // Mock implementation
      console.log("Generating map for coordinates:", formState.latitude, formState.longitude);
      
      setTimeout(() => {
        setIsGeneratingMap(false);
        setPendingChanges(true);
      }, 1000);
    } catch (error) {
      console.error("Error generating map:", error);
      setIsGeneratingMap(false);
    }
  }, [formState.latitude, formState.longitude, setPendingChanges]);
  
  const onRemoveNearbyPlace = useCallback((index: number) => {
    if (!formState.nearby_places) return;
    
    const updatedPlaces = [...formState.nearby_places];
    updatedPlaces.splice(index, 1);
    
    handleFieldChange("nearby_places", updatedPlaces);
    setPendingChanges(true);
    
    toast({
      title: "Place removed",
      description: "Nearby place has been removed successfully"
    });
  }, [formState.nearby_places, handleFieldChange, setPendingChanges, toast]);
  
  const onFetchCategoryPlaces = useCallback(async (category: string) => {
    if (!formState.latitude || !formState.longitude) {
      toast({
        title: "Error",
        description: "Property coordinates are required to fetch nearby places",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoadingLocationData(true);
    
    try {
      console.log("Fetching places for category:", category);
      
      // This would be replaced with a real API call in a production environment
      // Simulating API response for testing purposes
      const mockPlaces = Array(5).fill(null).map((_, i) => ({
        id: `mock-${category}-${i}`,
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Place ${i + 1}`,
        vicinity: "Near the property",
        rating: 4 + Math.random(),
        user_ratings_total: 10 + Math.floor(Math.random() * 90),
        type: category,
        types: [category],
        distance: 0.5 + Math.random() * 2,
        visible_in_webview: true,
        latitude: formState.latitude! + (Math.random() - 0.5) * 0.01,
        longitude: formState.longitude! + (Math.random() - 0.5) * 0.01
      }));
      
      const result = { [category]: mockPlaces };
      console.log("Mock result for category:", result);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoadingLocationData(false);
      return result;
    } catch (error) {
      console.error("Error fetching category places:", error);
      toast({
        title: "Error",
        description: `Failed to fetch ${category} places`,
        variant: "destructive"
      });
      setIsLoadingLocationData(false);
      return null;
    }
  }, [formState.latitude, formState.longitude, toast]);
  
  const onFetchNearbyCities = useCallback(async () => {
    if (!formState.latitude || !formState.longitude) {
      toast({
        title: "Error",
        description: "Property coordinates are required to fetch nearby cities",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      console.log("Fetching nearby cities");
      
      // Mock implementation
      const mockCities = [
        {
          id: "city-1",
          name: "Nearby City 1",
          distance: 5.2
        },
        {
          id: "city-2",
          name: "Nearby City 2",
          distance: 8.7
        }
      ];
      
      return mockCities;
    } catch (error) {
      console.error("Error fetching nearby cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby cities",
        variant: "destructive"
      });
      return null;
    }
  }, [formState.latitude, formState.longitude, toast]);
  
  return {
    onFetchLocationData,
    onGenerateLocationDescription,
    onGenerateMap,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    onFetchCategoryPlaces,
    onFetchNearbyCities
  };
}
