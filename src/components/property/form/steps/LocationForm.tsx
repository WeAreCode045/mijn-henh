
import React from "react";
import { PropertyStepForm } from "../PropertyStepForm";
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Locate } from "lucide-react";

interface LocationFormProps {
  formData: PropertyFormData;
  step: number;
  onStepChange: (step: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function LocationForm({
  formData,
  step,
  onStepChange,
  onFieldChange,
  onFetchLocationData,
  onGenerateLocationDescription,
  isLoadingLocationData = false,
  onSubmit,
  isSubmitting = false
}: LocationFormProps) {
  return (
    <PropertyStepForm
      formData={formData}
      step={step}
      onStepChange={onStepChange}
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="flex gap-2">
              <Input 
                id="address"
                value={formData.address || ''}
                onChange={(e) => onFieldChange('address', e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={onFetchLocationData}
                disabled={isLoadingLocationData || !formData.address}
                variant="outline"
              >
                <Locate className="h-4 w-4 mr-2" />
                Fetch Data
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input 
                id="latitude"
                value={formData.latitude || ''}
                onChange={(e) => onFieldChange('latitude', parseFloat(e.target.value) || null)}
                type="number"
                step="0.000001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input 
                id="longitude"
                value={formData.longitude || ''}
                onChange={(e) => onFieldChange('longitude', parseFloat(e.target.value) || null)}
                type="number"
                step="0.000001"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="location_description">Location Description</Label>
              <Button 
                type="button" 
                onClick={onGenerateLocationDescription}
                disabled={isLoadingLocationData || !formData.address}
                variant="outline"
                size="sm"
              >
                Generate Description
              </Button>
            </div>
            <Textarea 
              id="location_description"
              value={formData.location_description || ''}
              onChange={(e) => onFieldChange('location_description', e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
      </Card>
    </PropertyStepForm>
  );
}
