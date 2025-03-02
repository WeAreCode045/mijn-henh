
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PropertyFormData } from "@/types/property";

interface CoordinatesInputProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function CoordinatesInput({ formData, onFieldChange }: CoordinatesInputProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          type="number"
          id="latitude"
          value={formData.latitude || ''}
          onChange={(e) => onFieldChange('latitude', parseFloat(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          type="number"
          id="longitude"
          value={formData.longitude || ''}
          onChange={(e) => onFieldChange('longitude', parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
