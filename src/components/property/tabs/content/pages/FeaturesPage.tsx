
import React, { useState } from "react";
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { FeatureSelector } from "@/components/property/features/FeatureSelector";
import { useAvailableFeatures } from "@/hooks/useAvailableFeatures";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

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
  
  // Save feature changes directly to the database
  const saveFeaturesField = async (features: PropertyFeature[]) => {
    if (!formData.id) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ features: JSON.stringify(features) })
        .eq('id', formData.id);
        
      if (error) {
        console.error("Error saving features:", error);
      } else {
        console.log("Features saved to database successfully");
        if (setPendingChanges) {
          setPendingChanges(false);
        }
      }
    } catch (err) {
      console.error("Failed to save features:", err);
    }
  };
  
  const handleFeatureChange = async (id: string, description: string) => {
    // Update in-memory state
    onUpdateFeature(id, description);
    
    // Update features in the database directly - only the features field
    if (formData.id) {
      const updatedFeatures = formData.features.map(feature => 
        feature.id === id ? { ...feature, description } : feature
      );
      
      await saveFeaturesField(updatedFeatures);
    }
  };
  
  const handleAddFeature = async (feature: PropertyFeature) => {
    // If we already have this feature, don't add it again
    if (formData.features?.some(f => f.id === feature.id)) {
      return;
    }
    
    const updatedFeatures = [...(formData.features || []), feature];
    
    // Update in-memory state
    onFieldChange('features', updatedFeatures);
    
    // Update features in the database
    await saveFeaturesField(updatedFeatures);
  };
  
  const handleRemoveSelectedFeature = async (id: string) => {
    const updatedFeatures = formData.features?.filter(feature => feature.id !== id) || [];
    
    // Update in-memory state
    onFieldChange('features', updatedFeatures);
    
    // Update features in the database
    await saveFeaturesField(updatedFeatures);
  };
  
  const handleAddMultipleFeatures = async (newFeatures: PropertyFeature[]) => {
    // Add multiple features at once
    // First, add the new features to the available features list
    newFeatures.forEach(feature => {
      // Fix: Pass the description string instead of the whole feature object
      addToAvailableFeatures(feature.description);
    });
    
    // Update in-memory state with new features
    const updatedFeatures = [...(formData.features || []), ...newFeatures];
    onFieldChange('features', updatedFeatures);
    
    // Update features in the database
    await saveFeaturesField(updatedFeatures);
  };
  
  const handleAddClick = async () => {
    // Add a new feature
    onAddFeature();
    
    // Wait for state to update, then save to database
    setTimeout(async () => {
      await saveFeaturesField(formData.features);
    }, 0);
  };
  
  const handleRemoveClick = async (id: string) => {
    // Remove the feature
    onRemoveFeature(id);
    
    // Update features in the database - need to filter it manually since formData won't update yet
    const updatedFeatures = formData.features.filter(feature => feature.id !== id);
    await saveFeaturesField(updatedFeatures);
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
                onAdd={handleAddClick}
                onRemove={handleRemoveClick}
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
