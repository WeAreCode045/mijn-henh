
import React from "react";
import { PropertyFormData } from "@/types/property";
import { LocationStep } from "@/components/property/form/steps/LocationStep";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface LocationPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  onSubmit: () => void;
  isSaving: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function LocationPage({
  formData,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  onSubmit,
  isSaving,
  setPendingChanges
}: LocationPageProps) {
  const handleSave = () => {
    if (setPendingChanges) setPendingChanges(true);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <LocationStep
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchLocationData={onFetchLocationData}
        onFetchCategoryPlaces={onFetchCategoryPlaces}
        onFetchNearbyCities={onFetchNearbyCities}
        onGenerateLocationDescription={onGenerateLocationDescription}
        onGenerateMap={onGenerateMap}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        isLoadingLocationData={isLoadingLocationData}
        isGeneratingMap={isGeneratingMap}
        setPendingChanges={setPendingChanges}
      />
      
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
