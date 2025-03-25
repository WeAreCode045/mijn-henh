
import React, { useState, useEffect } from "react";
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { GlobalFeaturesSelector } from "@/components/property/features/GlobalFeaturesSelector";
import { useAvailableFeatures } from "@/hooks/useAvailableFeatures";
import { Loader2 } from "lucide-react";
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
  const { availableFeatures, isLoading } = useAvailableFeatures();
  const [globalFeatures, setGlobalFeatures] = useState<PropertyFeature[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  
  // Fetch global features on component mount
  useEffect(() => {
    const fetchGlobalFeatures = async () => {
      setIsLoadingGlobal(true);
      try {
        const { data, error } = await supabase
          .from('property_features')
          .select('*')
          .order('description', { ascending: true });
        
        if (error) {
          console.error("Error fetching global features:", error);
          return;
        }
        
        setGlobalFeatures(data || []);
      } catch (err) {
        console.error("Failed to fetch global features:", err);
      } finally {
        setIsLoadingGlobal(false);
      }
    };
    
    fetchGlobalFeatures();
  }, []);
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Global Features Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Global Features</h3>
              {isLoadingGlobal ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading global features...</span>
                </div>
              ) : (
                <GlobalFeaturesSelector
                  globalFeatures={globalFeatures}
                  propertyFeatures={formData.features || []}
                  onSelect={handleAddFeature}
                  onDeselect={handleRemoveSelectedFeature}
                />
              )}
            </div>
            
            {/* Custom Features Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add Custom Features</h3>
              <p className="text-sm text-muted-foreground mb-3">
                These features are specific to this property and won't be added to the global list.
              </p>
              <PropertyFeatures
                features={formData.features || []}
                onAdd={handleAddClick}
                onRemove={handleRemoveClick}
                onUpdate={handleFeatureChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
