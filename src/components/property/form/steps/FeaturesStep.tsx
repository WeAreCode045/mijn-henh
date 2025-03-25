
import { useState, useEffect } from "react";
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GlobalFeaturesSelector } from "@/components/property/features/GlobalFeaturesSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  const handleFeatureChange = async (id: string, description: string) => {
    // Now this is only called on blur, so we can update immediately
    onUpdateFeature(id, description);
    
    // Save the features field to the database directly
    if (formData.id) {
      try {
        const { error } = await supabase
          .from('properties')
          .update({ features: JSON.stringify(formData.features) })
          .eq('id', formData.id);
          
        if (error) {
          console.error("Error saving feature change:", error);
        } else {
          console.log("Feature updated and saved to database");
          if (setPendingChanges) {
            setPendingChanges(false);
          }
        }
      } catch (err) {
        console.error("Failed to save feature change:", err);
      }
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
      
      // Save the features field to the database
      if (formData.id) {
        try {
          supabase
            .from('properties')
            .update({ features: JSON.stringify(updatedFeatures) })
            .eq('id', formData.id)
            .then(({ error }) => {
              if (error) {
                console.error("Error saving feature addition:", error);
              } else {
                console.log("Feature added and saved to database");
                if (setPendingChanges) {
                  setPendingChanges(false);
                }
              }
            });
        } catch (err) {
          console.error("Failed to save feature addition:", err);
        }
      }
    }
  };
  
  const handleRemoveSelectedFeature = (id: string) => {
    if (onFieldChange) {
      const updatedFeatures = formData.features.filter(feature => feature.id !== id);
      onFieldChange('features', updatedFeatures);
      
      // Save the features field to the database
      if (formData.id) {
        try {
          supabase
            .from('properties')
            .update({ features: JSON.stringify(updatedFeatures) })
            .eq('id', formData.id)
            .then(({ error }) => {
              if (error) {
                console.error("Error saving feature removal:", error);
              } else {
                console.log("Feature removed and saved to database");
                if (setPendingChanges) {
                  setPendingChanges(false);
                }
              }
            });
        } catch (err) {
          console.error("Failed to save feature removal:", err);
        }
      }
    }
  };
  
  const handleGlobalFeatureSelect = (feature: PropertyFeature) => {
    // Add selected global feature to property features
    handleAddFeature(feature);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Property Features</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add all the distinctive features that make this property stand out.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Select Global Features</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingGlobal ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading global features...</span>
              </div>
            ) : (
              <GlobalFeaturesSelector
                globalFeatures={globalFeatures}
                propertyFeatures={formData.features}
                onSelect={handleGlobalFeatureSelect}
                onDeselect={handleRemoveSelectedFeature}
              />
            )}
          </CardContent>
        </Card>
        
        {/* Custom Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add Custom Features</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyFeatures
              features={formData.features || []} // Ensure we always pass an array
              onAdd={() => {
                onAddFeature();
                
                // Save the updated features to the database after adding
                if (formData.id) {
                  // We need to wait a tick for the formData to update
                  setTimeout(() => {
                    try {
                      supabase
                        .from('properties')
                        .update({ features: JSON.stringify(formData.features) })
                        .eq('id', formData.id)
                        .then(({ error }) => {
                          if (error) {
                            console.error("Error saving new feature:", error);
                          } else {
                            console.log("New feature saved to database");
                            if (setPendingChanges) {
                              setPendingChanges(false);
                            }
                          }
                        });
                    } catch (err) {
                      console.error("Failed to save new feature:", err);
                    }
                  }, 0);
                }
              }}
              onRemove={(id) => {
                onRemoveFeature(id);
                
                // Save the updated features to the database after removing
                if (formData.id) {
                  // We need to wait a tick for the formData to update
                  setTimeout(() => {
                    try {
                      supabase
                        .from('properties')
                        .update({ features: JSON.stringify(formData.features.filter(f => f.id !== id)) })
                        .eq('id', formData.id)
                        .then(({ error }) => {
                          if (error) {
                            console.error("Error saving feature removal:", error);
                          } else {
                            console.log("Feature removal saved to database");
                            if (setPendingChanges) {
                              setPendingChanges(false);
                            }
                          }
                        });
                    } catch (err) {
                      console.error("Failed to save feature removal:", err);
                    }
                  }, 0);
                }
              }}
              onUpdate={handleFeatureChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
