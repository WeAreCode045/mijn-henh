
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapSection } from "@/components/property/form/steps/location/MapSection";
import { NearbyPlacesSection } from "@/components/property/form/steps/location/components/NearbyPlacesSection";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Wand2, Save } from "lucide-react";

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
  isLoadingLocationData = false,
  isGeneratingMap = false,
  setPendingChanges
}: LocationPageProps) {
  // Create local state to track changes without saving immediately
  const [localFormData, setLocalFormData] = useState<PropertyFormData>(formData);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const { toast } = useToast();
  
  // Update local state when parent formData changes (e.g. initial load)
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // Handle local field changes without saving to DB
  const handleLocalFieldChange = (field: keyof PropertyFormData, value: any) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Notify parent component that there are pending changes
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleLocationDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleLocalFieldChange('location_description', e.target.value);
  };

  const handleGenerateDescription = async () => {
    if (!localFormData.id || !localFormData.address) {
      toast({
        title: "Error",
        description: "Property ID and address are required to generate a description",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingDescription(true);
    
    try {
      // Get OpenAI API key from settings first
      const { data: settingsData, error: settingsError } = await supabase
        .from('agency_settings')
        .select('openai_api_key')
        .single();
      
      if (settingsError) {
        console.error("Error fetching API key from settings:", settingsError);
        throw new Error("Could not fetch OpenAI API key from settings");
      }
      
      const apiKey = settingsData?.openai_api_key;
      
      if (!apiKey) {
        console.error("No OpenAI API key found in settings");
        toast({
          title: "Missing API Key",
          description: "Please set an OpenAI API key in your agency settings",
          variant: "destructive"
        });
        return;
      }
      
      // Call the edge function to generate the description
      const { data, error } = await supabase.functions.invoke('generate-location-description', {
        body: { 
          address: localFormData.address,
          nearbyPlaces: localFormData.nearby_places || [],
          description: localFormData.description,
          language: 'nl',
          maxLength: 1000
        }
      });
      
      if (error) throw error;
      
      if (data?.description) {
        // Update only the local state
        handleLocalFieldChange('location_description', data.description);
        
        toast({
          title: "Success",
          description: "Location description generated successfully. Don't forget to save your changes!",
        });
      } else {
        throw new Error("No description was generated");
      }
    } catch (error: any) {
      console.error("Error generating location description:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate location description",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleCategorySearch = async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onFetchCategoryPlaces) {
      console.log(`LocationPage: Handling search for category ${category}`);
      // Make the actual API call and return the results
      return await onFetchCategoryPlaces(category);
    }
    return null;
  };

  // Save all changes to the database when save button is clicked
  const handleSaveChanges = async () => {
    if (!localFormData.id) return;

    setIsSaving(true);
    try {
      // Extract fields that are different from the original formData
      const changedFields: Record<string, any> = {};
      
      Object.keys(localFormData).forEach((key) => {
        const typedKey = key as keyof PropertyFormData;
        if (JSON.stringify(localFormData[typedKey]) !== JSON.stringify(formData[typedKey])) {
          changedFields[key] = localFormData[typedKey];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast({
          description: "No changes to save",
        });
        setIsSaving(false);
        return;
      }
      
      // Save changes to database
      const { error } = await supabase
        .from('properties')
        .update(changedFields)
        .eq('id', localFormData.id);

      if (error) throw error;

      // Update parent state
      Object.keys(changedFields).forEach((key) => {
        onFieldChange(key as keyof PropertyFormData, changedFields[key]);
      });

      // Notify success
      toast({
        title: "Saved",
        description: "All changes have been saved successfully",
      });

      // Reset pending changes flag
      if (setPendingChanges) {
        setPendingChanges(false);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location_description">Location Description</Label>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription || !localFormData.address}
                    className="flex gap-2 items-center"
                  >
                    {isGeneratingDescription ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Generate Description
                      </>
                    )}
                  </Button>
                </div>
                
                <Textarea
                  id="location_description"
                  name="location_description"
                  value={localFormData.location_description || ''}
                  onChange={handleLocationDescriptionChange}
                  placeholder="Describe the location and surrounding area..."
                  className="min-h-[300px]"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <MapSection 
                formData={localFormData}
                onFieldChange={handleLocalFieldChange}
                onFetchLocationData={onFetchLocationData}
                onGenerateMap={onGenerateMap}
                isLoadingLocationData={isLoadingLocationData}
                isGeneratingMap={isGeneratingMap}
                setPendingChanges={setPendingChanges}
                hideControls={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <NearbyPlacesSection 
        formData={localFormData}
        onFieldChange={handleLocalFieldChange}
        onFetchCategoryPlaces={onFetchCategoryPlaces}
        isLoadingNearbyPlaces={isLoadingLocationData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        onSearchClick={handleCategorySearch}
      />
      
      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSaveChanges} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
