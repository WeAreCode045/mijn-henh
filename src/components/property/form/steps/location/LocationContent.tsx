
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LocationContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
}

export function LocationContent({
  formData,
  onFieldChange,
  onFetchLocationData,
  onGenerateLocationDescription,
  onGenerateMap,
  isLoadingLocationData,
  isGeneratingMap
}: LocationContentProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => onFieldChange('address', e.target.value)}
              placeholder="Property address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={formData.latitude?.toString() || ''}
                onChange={(e) => onFieldChange('latitude', parseFloat(e.target.value) || null)}
                placeholder="Latitude coordinate"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={formData.longitude?.toString() || ''}
                onChange={(e) => onFieldChange('longitude', parseFloat(e.target.value) || null)}
                placeholder="Longitude coordinate"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Location Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="location_description">Location Description</Label>
            <Textarea
              id="location_description"
              value={formData.location_description || ''}
              onChange={(e) => onFieldChange('location_description', e.target.value)}
              placeholder="Describe the location and surroundings"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
