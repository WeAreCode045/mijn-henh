
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { FeatureSelector } from "@/components/property/features/FeatureSelector";
import { useAvailableFeatures } from "@/hooks/useAvailableFeatures";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface FeaturesStepProps {
  formData: PropertyFormData;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function FeaturesStep({
  formData,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onFieldChange,
  setPendingChanges
}: FeaturesStepProps) {
  console.log("FeaturesStep rendering with features:", formData.features);
  
  const { availableFeatures, isLoading, addFeature, addMultipleFeatures } = useAvailableFeatures();
  
  const handleFeatureChange = (id: string, description: string) => {
    // Now this is only called on blur, so we can update immediately
    onUpdateFeature(id, description);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAddFeature = (feature: PropertyFeature) => {
    // If we already have this feature, don't add it again
    if (formData.features.some(f => f.id === feature.id)) {
      return;
    }
    
    // Add the feature to the property
    if (onFieldChange) {
      const updatedFeatures = [...formData.features, feature];
      onFieldChange('features', updatedFeatures);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };
  
  const handleRemoveSelectedFeature = (id: string) => {
    if (onFieldChange) {
      const updatedFeatures = formData.features.filter(feature => feature.id !== id);
      onFieldChange('features', updatedFeatures);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };
  
  const handleAddMultipleFeatures = (newFeatures: PropertyFeature[]) => {
    // Add multiple features at once
    if (onFieldChange) {
      // First, add the new features to the available features list
      addMultipleFeatures(newFeatures);
      
      // Then add them to the property
      const updatedFeatures = [...formData.features, ...newFeatures];
      onFieldChange('features', updatedFeatures);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Property Features</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add all the distinctive features that make this property stand out.
      </p>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Manual Entry</TabsTrigger>
          <TabsTrigger value="select">Select Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <PropertyFeatures
            features={formData.features || []} // Ensure we always pass an array
            onAdd={() => {
              onAddFeature();
              if (setPendingChanges) {
                setPendingChanges(true);
              }
            }}
            onRemove={(id) => {
              onRemoveFeature(id);
              if (setPendingChanges) {
                setPendingChanges(true);
              }
            }}
            onUpdate={handleFeatureChange}
          />
        </TabsContent>
        
        <TabsContent value="select">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading features...</span>
            </div>
          ) : (
            <FeatureSelector
              availableFeatures={availableFeatures}
              selectedFeatures={formData.features || []}
              onAddFeature={handleAddFeature}
              onRemoveFeature={handleRemoveSelectedFeature}
              onAddMultipleFeatures={handleAddMultipleFeatures}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
