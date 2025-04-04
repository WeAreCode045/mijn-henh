
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPreviewSection } from "./location/MapPreviewSection";
import { NearbyPlacesSection } from "./location/components/NearbyPlacesSection";
import { NearbyCitiesSection } from "./location/NearbyCitiesSection";
import { LocationDescriptionSection } from "./location/LocationDescriptionSection";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface LocationStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  handleMapImageDelete?: () => Promise<void>;
}

export function LocationStep({
  formData,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges,
  handleMapImageDelete,
  onGenerateMap,
  isGeneratingMap = false
}: LocationStepProps) {
  const { toast } = useToast();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const handleCategorySearch = async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate that we have a property ID
    if (!formData.id) {
      console.error("LocationStep: Cannot fetch places: Missing property ID");
      toast({
        title: "Error",
        description: "Please save the property first before searching for places",
        variant: "destructive"
      });
      return null;
    }
    
    console.log(`LocationStep: Handling search for category ${category}`);
    
    if (onFetchCategoryPlaces) {
      // Make the actual API call through the passed function
      return await onFetchCategoryPlaces(category);
    }
    return null;
  };

  const handleGenerateDescription = async () => {
    if (!onGenerateLocationDescription) return;
    
    setIsGeneratingDescription(true);
    try {
      await onGenerateLocationDescription();
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <LocationDescriptionSection 
              formData={formData}
              onFieldChange={onFieldChange}
              onGenerateDescription={handleGenerateDescription}
              isGeneratingDescription={isGeneratingDescription}
            />
            
            <MapPreviewSection 
              formData={formData}
              onDeleteMapImage={handleMapImageDelete}
              onGenerateMap={onGenerateMap}
              isGeneratingMap={isGeneratingMap}
            />
            
            <NearbyPlacesSection 
              formData={formData}
              onRemoveNearbyPlace={onRemoveNearbyPlace}
              onFieldChange={onFieldChange}
              onFetchCategoryPlaces={onFetchCategoryPlaces}
              isLoadingNearbyPlaces={isLoadingLocationData}
              onSearchClick={handleCategorySearch}
            />
            
            <NearbyCitiesSection 
              formData={formData}
              onFetchLocationData={onFetchLocationData}
              onFetchNearbyCities={onFetchNearbyCities}
              isLoadingLocationData={isLoadingLocationData}
              onFieldChange={onFieldChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
