
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PropertyFormData } from "@/types/property";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function PropertySpecs({ formData, onFieldChange }: PropertySpecsProps) {
  const handleChange = (field: keyof PropertyFormData, value: string) => {
    console.log(`PropertySpecs - ${field} changed to:`, value);
    onFieldChange(field, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input
          id="bedrooms"
          type="number"
          value={formData.bedrooms || ''}
          onChange={(e) => handleChange('bedrooms', e.target.value)}
          placeholder="Number of bedrooms"
        />
      </div>
      <div>
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          type="number"
          value={formData.bathrooms || ''}
          onChange={(e) => handleChange('bathrooms', e.target.value)}
          placeholder="Number of bathrooms"
        />
      </div>
      <div>
        <Label htmlFor="sqft">Lot Size (sqft)</Label>
        <Input
          id="sqft"
          type="text"
          value={formData.sqft || ''}
          onChange={(e) => handleChange('sqft', e.target.value)}
          placeholder="Lot size in square feet"
        />
      </div>
      <div>
        <Label htmlFor="livingArea">Living Area (sqft)</Label>
        <Input
          id="livingArea"
          type="text"
          value={formData.livingArea || ''}
          onChange={(e) => handleChange('livingArea', e.target.value)}
          placeholder="Living area in square feet"
        />
      </div>
      <div>
        <Label htmlFor="buildYear">Build Year</Label>
        <Input
          id="buildYear"
          type="text"
          value={formData.buildYear || ''}
          onChange={(e) => handleChange('buildYear', e.target.value)}
          placeholder="Year built"
        />
      </div>
      <div>
        <Label htmlFor="energyLabel">Energy Label</Label>
        <Input
          id="energyLabel"
          type="text"
          value={formData.energyLabel || ''}
          onChange={(e) => handleChange('energyLabel', e.target.value)}
          placeholder="Energy label"
        />
      </div>
    </div>
  );
}
