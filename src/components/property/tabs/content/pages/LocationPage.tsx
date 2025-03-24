
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
                  
                  {onGenerateLocationDescription && (
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (onGenerateLocationDescription) {
                          onGenerateLocationDescription();
                        }
                      }}
                      disabled={isLoadingLocationData}
                    >
                      {isLoadingLocationData ? 'Generating...' : 'Generate Description'}
                    </Button>
                  )}
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
