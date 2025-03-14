
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function PropertySpecs({ formData, onFieldChange }: PropertySpecsProps) {
  const handleChange = (field: keyof PropertyFormData, value: string) => {
    onFieldChange(field, value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Key Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="buildYear">Build Year</Label>
            <Input
              id="buildYear"
              type="text"
              value={formData.buildYear || ''}
              onChange={(e) => handleChange('buildYear', e.target.value)}
              placeholder="Build Year"
              className="mt-1 p-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sqft">Lot Size (m²)</Label>
            <Input
              id="sqft"
              type="text"
              value={formData.sqft || ''}
              onChange={(e) => handleChange('sqft', e.target.value)}
              placeholder="Lot Size"
              className="mt-1 p-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="livingArea">Living Area (m²)</Label>
            <Input
              id="livingArea"
              type="text"
              value={formData.livingArea || ''}
              onChange={(e) => handleChange('livingArea', e.target.value)}
              placeholder="Living Area"
              className="mt-1 p-2"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="text"
              value={formData.bedrooms || ''}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              placeholder="Bedrooms"
              className="mt-1 p-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="text"
              value={formData.bathrooms || ''}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              placeholder="Bathrooms"
              className="mt-1 p-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energyLabel">Energy Class</Label>
            <Input
              id="energyLabel"
              type="text"
              value={formData.energyLabel || ''}
              onChange={(e) => handleChange('energyLabel', e.target.value)}
              placeholder="Energy Class"
              className="mt-1 p-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
