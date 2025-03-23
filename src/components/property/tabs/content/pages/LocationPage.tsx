
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapSection } from "@/components/property/form/steps/location/MapSection";
import { NearbyPlacesSection } from "@/components/property/form/steps/location/NearbyPlacesSection";

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
  onGenerateMap,
  isLoadingLocationData = false,
  isGeneratingMap = false,
  setPendingChanges
}: LocationPageProps) {
  const handleLocationDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('location_description', e.target.value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <MapSection 
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchLocationData={onFetchLocationData}
        onGenerateMap={onGenerateMap}
        isLoadingLocationData={isLoadingLocationData}
        isGeneratingMap={isGeneratingMap}
        setPendingChanges={setPendingChanges}
      />
      
      {/* Nearby Places */}
      <NearbyPlacesSection 
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchCategoryPlaces={onFetchCategoryPlaces}
        isLoadingNearbyPlaces={isLoadingLocationData}
      />
      
      {/* Location Description */}
      <Card>
        <CardHeader>
          <CardTitle>Location Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="location_description">Description</Label>
              
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
              value={formData.location_description || ''}
              onChange={handleLocationDescriptionChange}
              placeholder="Describe the location and surrounding area..."
              className="min-h-[150px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
