
import React, { useState, useEffect } from "react";
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { GlobalFeaturesSelector } from "@/components/property/features/GlobalFeaturesSelector";
import { useAvailableFeatures } from "@/hooks/useAvailableFeatures";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Local state for features
  const [localFeatures, setLocalFeatures] = useState<PropertyFeature[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Initialize local state from formData
  useEffect(() => {
    setLocalFeatures(formData.features || []);
  }, [formData.features]);
  
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
  
  // Save feature changes to the database
  const saveFeatures = async () => {
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ features: JSON.stringify(localFeatures) })
        .eq('id', formData.id);
        
      if (error) {
        console.error("Error saving features:", error);
        toast({
          title: "Error",
          description: "Failed to save features",
          variant: "destructive"
        });
      } else {
        console.log("Features saved to database successfully");
        toast({
          title: "Success",
          description: "Features updated successfully",
        });
        
        // Update parent state
        onFieldChange('features', localFeatures);
        
        if (setPendingChanges) {
          setPendingChanges(false);
        }
        
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Failed to save features:", err);
      toast({
        title: "Error",
        description: "Failed to save features",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Local handlers
  const handleFeatureChange = (id: string, description: string) => {
    const updatedFeatures = localFeatures.map(feature => 
      feature.id === id ? { ...feature, description } : feature
    );
    
    setLocalFeatures(updatedFeatures);
    setHasChanges(true);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAddFeature = () => {
    // Call parent's add feature function but update local state
    onAddFeature();
    
    // Update local state after a slight delay to allow the parent state to update
    setTimeout(() => {
      setLocalFeatures(formData.features || []);
      setHasChanges(true);
      
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }, 10);
  };
  
  const handleRemoveFeature = (id: string) => {
    const updatedFeatures = localFeatures.filter(feature => feature.id !== id);
    setLocalFeatures(updatedFeatures);
    setHasChanges(true);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAddGlobalFeature = (feature: PropertyFeature) => {
    // If we already have this feature, don't add it again
    if (localFeatures.some(f => f.id === feature.id)) {
      return;
    }
    
    const updatedFeatures = [...localFeatures, feature];
    setLocalFeatures(updatedFeatures);
    setHasChanges(true);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleRemoveSelectedFeature = (id: string) => {
    const updatedFeatures = localFeatures.filter(feature => feature.id !== id);
    setLocalFeatures(updatedFeatures);
    setHasChanges(true);
    
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
                  propertyFeatures={localFeatures || []}
                  onSelect={handleAddGlobalFeature}
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
                features={localFeatures || []}
                onAdd={handleAddFeature}
                onRemove={handleRemoveFeature}
                onUpdate={handleFeatureChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={saveFeatures} 
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Features
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
