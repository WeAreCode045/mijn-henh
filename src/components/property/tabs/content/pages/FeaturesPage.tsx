
import React, { useState, useRef } from "react";
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { FeatureSelector } from "@/components/property/features/FeatureSelector";
import { useAvailableFeatures } from "@/hooks/useAvailableFeatures";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface FeaturesPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function FeaturesPage({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  setPendingChanges
}: FeaturesPageProps) {
  const [activeTab, setActiveTab] = useState<string>("manual");
  const { availableFeatures, isLoading, addFeature: addToAvailableFeatures } = useAvailableFeatures();
  
  const handleFeatureChange = (id: string, description: string) => {
    // The debouncing is now handled in the PropertyFeatures component
    onUpdateFeature(id, description);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAddFeature = (feature: PropertyFeature) => {
    // If we already have this feature, don't add it again
    if (formData.features?.some(f => f.id === feature.id)) {
      return;
    }
    
    const updatedFeatures = [...(formData.features || []), feature];
    onFieldChange('features', updatedFeatures);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleRemoveSelectedFeature = (id: string) => {
    const updatedFeatures = formData.features?.filter(feature => feature.id !== id) || [];
    onFieldChange('features', updatedFeatures);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAddMultipleFeatures = (newFeatures: PropertyFeature[]) => {
    // Add multiple features at once
    // First, add the new features to the available features list
    newFeatures.forEach(feature => {
      // Fix: Pass the description string instead of the whole feature object
      addToAvailableFeatures(feature.description);
    });
    
    // Then add them to the property
    const updatedFeatures = [...(formData.features || []), ...newFeatures];
    onFieldChange('features', updatedFeatures);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="select">Select Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <PropertyFeatures
                features={formData.features || []}
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
        </CardContent>
      </Card>
    </div>
  );
}
