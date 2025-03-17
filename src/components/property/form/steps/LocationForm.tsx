
import React from "react";
import { PropertyStepForm } from "../PropertyStepForm";
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Locate } from "lucide-react";
import { LocationStep } from "./LocationStep";

interface LocationFormProps {
  formData: PropertyFormData;
  step: number;
  onStepChange: (step: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function LocationForm({
  formData,
  step,
  onStepChange,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData = false,
  isGeneratingMap = false,
  onSubmit,
  isSubmitting = false
}: LocationFormProps) {
  return (
    <PropertyStepForm
      formData={formData}
      step={step}
      onStepChange={onStepChange}
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <LocationStep
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchLocationData={onFetchLocationData}
        onFetchCategoryPlaces={onFetchCategoryPlaces || ((category: string) => Promise.resolve())}
        onFetchNearbyCities={onFetchNearbyCities || (() => Promise.resolve())}
        onGenerateLocationDescription={onGenerateLocationDescription}
        onGenerateMap={onGenerateMap || (() => Promise.resolve())}
        onRemoveNearbyPlace={onRemoveNearbyPlace || (() => {})}
        isLoadingLocationData={isLoadingLocationData}
        isGeneratingMap={isGeneratingMap}
        setPendingChanges={() => {}}
      />
    </PropertyStepForm>
  );
}
