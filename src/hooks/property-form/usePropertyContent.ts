
import { useState, useCallback } from "react";
import { PropertyFormData, PropertyPlaceType, PropertyCity, PropertySubmitData } from "@/types/property";
import { usePropertyDatabase } from "./usePropertyDatabase";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyContent(
  formData: PropertyFormData,
  handleFieldChange: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadingLocationData, setIsLoadingLocationData] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  const { toast } = useToast();
  const { updateProperty, createProperty } = usePropertyDatabase();

  // Navigation functions
  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Location data fetching
  const fetchLocationData = useCallback(async () => {
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingLocationData(true);
    
    try {
      // Mock implementation - would normally call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data
      handleFieldChange('latitude', 52.3676);
      handleFieldChange('longitude', 4.9041);
      
      toast({
        title: "Success",
        description: "Location data fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch location data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLocationData(false);
    }
  }, [formData.address, handleFieldChange, toast]);

  // Category places fetching
  const fetchCategoryPlaces = useCallback(async (category: string) => {
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Location data is required. Please fetch location data first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Mock implementation - would normally call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add a mock place
      const mockPlace: PropertyPlaceType = {
        id: `mock-${category}-${Date.now()}`,
        place_id: `mock-${category}-${Date.now()}`,
        name: `Mock ${category.replace('_', ' ')}`,
        vicinity: "Mock Address",
        type: category,
        types: [category],
        distance: 0.5 + Math.random() * 2
      };
      
      const currentPlaces = formData.nearby_places || [];
      handleFieldChange('nearby_places', [...currentPlaces, mockPlace]);
      
      toast({
        title: "Success",
        description: `Found nearby ${category.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error(`Error fetching ${category} places:`, error);
      toast({
        title: "Error",
        description: `Failed to fetch ${category.replace('_', ' ')}`,
        variant: "destructive",
      });
    }
    
    return null; // Return value to satisfy Promise return type
  }, [formData.latitude, formData.longitude, formData.nearby_places, handleFieldChange, toast]);

  // Nearby cities fetching
  const fetchNearbyCities = useCallback(async () => {
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Location data is required. Please fetch location data first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Mock implementation - would normally call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add mock cities
      const mockCities: PropertyCity[] = [
        { id: "city1", name: "Nearby City 1", distance: 5 + Math.random() * 5 },
        { id: "city2", name: "Nearby City 2", distance: 10 + Math.random() * 10 }
      ];
      
      handleFieldChange('nearby_cities', mockCities);
      
      toast({
        title: "Success",
        description: "Nearby cities found",
      });
    } catch (error) {
      console.error("Error fetching nearby cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby cities",
        variant: "destructive",
      });
    }
    
    return null; // Return value to satisfy Promise return type
  }, [formData.latitude, formData.longitude, handleFieldChange, toast]);

  // Generate location description
  const generateLocationDescription = useCallback(async () => {
    if (!formData.address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Mock implementation - would normally call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock description
      const mockDescription = `This property is located in a beautiful neighborhood near the city center. It's close to various amenities including shops, restaurants, and parks. The area is well-connected with public transportation options.`;
      
      handleFieldChange('location_description', mockDescription);
      
      toast({
        title: "Success",
        description: "Location description generated",
      });
    } catch (error) {
      console.error("Error generating location description:", error);
      toast({
        title: "Error",
        description: "Failed to generate location description",
        variant: "destructive",
      });
    }
  }, [formData.address, handleFieldChange, toast]);

  // Generate map image
  const generateMapImage = useCallback(async () => {
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Location data is required. Please fetch location data first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingMap(true);
    
    try {
      // Mock implementation - would normally call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set mock map image
      const mockMapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=52.3676,4.9041&zoom=14&size=600x300&key=API_KEY";
      
      handleFieldChange('map_image', mockMapUrl);
      
      toast({
        title: "Success",
        description: "Map image generated",
      });
    } catch (error) {
      console.error("Error generating map:", error);
      toast({
        title: "Error",
        description: "Failed to generate map",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMap(false);
    }
  }, [formData.latitude, formData.longitude, handleFieldChange, toast]);

  // Remove nearby place
  const removeNearbyPlace = useCallback((index: number) => {
    const currentPlaces = formData.nearby_places || [];
    if (index >= 0 && index < currentPlaces.length) {
      const newPlaces = [...currentPlaces];
      newPlaces.splice(index, 1);
      handleFieldChange('nearby_places', newPlaces);
      
      setPendingChanges(true);
    }
  }, [formData.nearby_places, handleFieldChange]);

  // Submit form
  const onSubmit = useCallback(async () => {
    setIsSaving(true);
    
    try {
      // Ensure required fields are present
      const requiredSubmitData: Partial<PropertySubmitData> = {
        ...formData,
        title: formData.title || "",
        price: formData.price || "",
        address: formData.address || "",
        bedrooms: formData.bedrooms || "",
        bathrooms: formData.bathrooms || "",
        sqft: formData.sqft || "",
        livingArea: formData.livingArea || "",
        buildYear: formData.buildYear || "",
        garages: formData.garages || "",
        energyLabel: formData.energyLabel || "",
        hasGarden: formData.hasGarden || false,
        description: formData.description || "",
        // Convert complex objects to strings
        features: JSON.stringify(formData.features || []),
        areas: JSON.stringify(formData.areas || []),
        nearby_places: JSON.stringify(formData.nearby_places || []),
        nearby_cities: JSON.stringify(formData.nearby_cities || []),
        images: (formData.images || []).map(img => typeof img === 'string' ? img : img.url),
        generalInfo: JSON.stringify(formData.generalInfo || {})
      };
      
      let success;
      
      if (formData.id) {
        // Update existing property
        success = await updateProperty(formData.id, requiredSubmitData as PropertySubmitData);
      } else {
        // Create new property
        success = await createProperty(requiredSubmitData as PropertySubmitData);
      }
      
      if (success) {
        setLastSaved(new Date());
        setPendingChanges(false);
        
        toast({
          title: "Success",
          description: "Property saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, updateProperty, createProperty, toast]);

  return {
    // Location data methods
    fetchLocationData,
    fetchCategoryPlaces,
    fetchNearbyCities,
    generateLocationDescription,
    generateMapImage,
    removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    
    // Navigation
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    
    // Submission
    lastSaved,
    isSaving,
    setPendingChanges,
    onSubmit
  };
}
