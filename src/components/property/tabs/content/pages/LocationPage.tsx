
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { EditButton } from "@/components/property/content/EditButton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NearbyPlaces } from "@/components/property/location/NearbyPlaces";
import { preparePropertiesForJsonField } from "@/hooks/property-form/preparePropertyData";

interface LocationPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
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
  isLoadingLocationData = false,
  setPendingChanges
}: LocationPageProps) {
  const { toast } = useToast();
  const [isEditingLocationDesc, setIsEditingLocationDesc] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [locationDescription, setLocationDescription] = useState(formData.location_description || '');

  const generateDescription = async () => {
    if (onGenerateLocationDescription) {
      await onGenerateLocationDescription();
      // Update local state after generation
      setLocationDescription(formData.location_description || '');
    }
  };

  const saveLocationDescription = async () => {
    if (!formData.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          location_description: locationDescription
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Update parent state
      onFieldChange('location_description', locationDescription);
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "Location description updated successfully",
      });
      
      setIsEditingLocationDesc(false);
    } catch (error) {
      console.error("Error updating location description:", error);
      toast({
        title: "Error",
        description: "Could not update location description",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveNearbyPlaces = async () => {
    if (!formData.id) return;
    
    try {
      // Prepare the data for update
      const nearbyPlacesJson = preparePropertiesForJsonField(formData.nearby_places || []);
      const nearbyCitiesJson = preparePropertiesForJsonField(formData.nearby_cities || []);
      
      const { error } = await supabase
        .from('properties')
        .update({ 
          nearby_places: nearbyPlacesJson,
          nearby_cities: nearbyCitiesJson
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "Nearby places and cities updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating nearby places:", error);
      toast({
        title: "Error",
        description: "Could not update nearby places",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Description */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Location Description</CardTitle>
          <div className="flex gap-2">
            {isEditingLocationDesc && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={isLoadingLocationData || !formData.address}
                className="flex gap-2 items-center"
              >
                {isLoadingLocationData ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            )}
            <EditButton
              isEditing={isEditingLocationDesc}
              onToggle={() => setIsEditingLocationDesc(!isEditingLocationDesc)}
              onSave={saveLocationDescription}
              isSaving={isSaving}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isEditingLocationDesc ? (
            <div className="space-y-2">
              <Textarea
                id="location_description"
                name="location_description"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="Describe the property location and surroundings"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                {formData.address ? 
                  "You can use the Generate button to create a description based on the property address." :
                  "Add a property address to use the auto-generate feature."}
              </p>
            </div>
          ) : (
            <div>
              {locationDescription ? (
                <p className="whitespace-pre-wrap">{locationDescription}</p>
              ) : (
                <p className="text-muted-foreground italic">No location description added yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nearby Places */}
      <NearbyPlaces 
        places={formData.nearby_places || []}
        cities={formData.nearby_cities || []}
        onFetchCategory={onFetchCategoryPlaces}
        onFetchCities={onFetchNearbyCities}
        isDisabled={isLoadingLocationData || !formData.address}
        onSave={saveNearbyPlaces}
      />
    </div>
  );
}
