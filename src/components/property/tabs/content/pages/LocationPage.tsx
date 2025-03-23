
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Locate, FileText, Map } from "lucide-react";
import { ContentSaveButton } from "@/components/property/form/steps/common/ContentSaveButton";

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
  onSubmit?: () => void;
  isSaving?: boolean;
}

export function LocationPage({
  formData,
  onFieldChange,
  onFetchLocationData,
  onGenerateLocationDescription,
  onGenerateMap,
  isLoadingLocationData = false,
  isGeneratingMap = false,
  setPendingChanges,
  onSubmit,
  isSaving = false
}: LocationPageProps) {
  
  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleFetchLocation = async () => {
    if (onFetchLocationData) {
      await onFetchLocationData();
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };
  
  const handleGenerateDescription = async () => {
    if (onGenerateLocationDescription) {
      await onGenerateLocationDescription();
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };
  
  const handleGenerateMap = async () => {
    if (onGenerateMap) {
      await onGenerateMap();
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };

  const handleSave = () => {
    if (onSubmit) {
      onSubmit();
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter property address"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleFetchLocation}
                disabled={isLoadingLocationData || !formData.address}
              >
                <Locate className="mr-2 h-4 w-4" />
                Fetch Data
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={formData.latitude?.toString() || ''}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || null)}
                placeholder="Latitude"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={formData.longitude?.toString() || ''}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || null)}
                placeholder="Longitude"
                readOnly
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="location_description">Location Description</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateDescription}
                disabled={isLoadingLocationData || !formData.address}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Description
              </Button>
            </div>
            <Textarea
              id="location_description"
              value={formData.location_description || ''}
              onChange={(e) => handleInputChange('location_description', e.target.value)}
              placeholder="Describe the location and neighborhood"
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="map_image">Map Image</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateMap}
                disabled={isGeneratingMap || !formData.latitude || !formData.longitude}
              >
                <Map className="mr-2 h-4 w-4" />
                Generate Map
              </Button>
            </div>
            
            {formData.map_image ? (
              <div className="mt-2 border rounded-md overflow-hidden">
                <img 
                  src={formData.map_image} 
                  alt="Property Map" 
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
                <MapPin className="mx-auto h-8 w-8 mb-2" />
                <p>No map image available. Generate one using the button above.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <ContentSaveButton onSave={handleSave} isSaving={isSaving} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
