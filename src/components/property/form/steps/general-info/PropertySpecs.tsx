
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Key Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="buildYear">Build Year</Label>
            <Input
              id="buildYear"
              type="text"
              value={formData.buildYear || ''}
              onChange={(e) => handleChange('buildYear', e.target.value)}
              placeholder="Year built"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sqft">Lot Size (m²)</Label>
            <Input
              id="sqft"
              type="text"
              value={formData.sqft || ''}
              onChange={(e) => handleChange('sqft', e.target.value)}
              placeholder="Lot size in square meters"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="livingArea">Living Area (m²)</Label>
            <Input
              id="livingArea"
              type="text"
              value={formData.livingArea || ''}
              onChange={(e) => handleChange('livingArea', e.target.value)}
              placeholder="Living area in square meters"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              value={formData.bedrooms || ''}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              placeholder="Number of bedrooms"
              className="mt-1"
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
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="energyLabel">Energy Class</Label>
            <Input
              id="energyLabel"
              type="text"
              value={formData.energyLabel || ''}
              onChange={(e) => handleChange('energyLabel', e.target.value)}
              placeholder="Energy class"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
