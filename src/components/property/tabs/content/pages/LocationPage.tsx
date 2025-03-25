
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapSection } from "@/components/property/form/steps/location/MapSection";
import { NearbyPlacesSection } from "@/components/property/form/steps/location/components/NearbyPlacesSection";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Wand2 } from "lucide-react";

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
  const { toast } = useToast();
  const [isGeneratingDescription, setIsGeneratingDescription] = React.useState(false);
  
  const handleLocationDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('location_description', e.target.value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (!formData.id) return;
      
      try {
        const { error } = await supabase
          .from('properties')
          .update({ location_description: formData.location_description })
          .eq('id', formData.id);
          
        if (error) throw error;
        
        toast({
          title: "Saved",
          description: "Location description updated successfully",
        });
        
        if (setPendingChanges) {
          setPendingChanges(false);
        }
      } catch (error) {
        console.error("Error saving location description:", error);
        toast({
          title: "Error",
          description: "Failed to save location description",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleGenerateDescription = async () => {
    if (!formData.id || !formData.address) {
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
          address: formData.address,
          nearbyPlaces: formData.nearby_places || [],
          description: formData.description,
          language: 'nl',
          maxLength: 1000
        }
      });
      
      if (error) throw error;
      
      if (data?.description) {
        // Update the form state
        onFieldChange('location_description', data.description);
        
        // Save to database
        const { error: updateError } = await supabase
          .from('properties')
          .update({ location_description: data.description })
          .eq('id', formData.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Success",
          description: "Location description generated successfully",
        });
        
        if (setPendingChanges) {
          setPendingChanges(false);
        }
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
                    disabled={isGeneratingDescription || !formData.address}
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
                  value={formData.location_description || ''}
                  onChange={handleLocationDescriptionChange}
                  onBlur={handleBlur}
                  placeholder="Describe the location and surrounding area..."
                  className="min-h-[300px]"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <MapSection 
                formData={formData}
                onFieldChange={onFieldChange}
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
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchCategoryPlaces={onFetchCategoryPlaces}
        isLoadingNearbyPlaces={isLoadingLocationData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        onSearchClick={handleCategorySearch}
      />
    </div>
  );
}
