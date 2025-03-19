
import React from "react";
import { Input } from "@/components/ui/input";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange?: (section: string, field: string, value: any) => void;
}

export function PropertySpecs({
  formData,
  onFieldChange,
  onGeneralInfoChange
}: PropertySpecsProps) {
  const handleSelectPropertyType = (value: string) => {
    if (formData.propertyType !== value) {
      onFieldChange("propertyType", value);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(field, e.target.value);
  };

  const handleLotSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', 'lotSize', e.target.value);
    }
    onFieldChange("sqft", e.target.value);
  };

  const handleLivingAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', 'livingArea', e.target.value);
    }
    onFieldChange("livingArea", e.target.value);
  };

  const handleBuildYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', 'buildYear', e.target.value);
    }
    onFieldChange("buildYear", e.target.value);
  };

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', 'bedrooms', e.target.value);
    }
    onFieldChange("bedrooms", e.target.value);
  };

  const handleBathroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', 'bathrooms', e.target.value);
    }
    onFieldChange("bathrooms", e.target.value);
  };

  const handleEnergyLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', 'energyClass', e.target.value);
    }
    onFieldChange("energyLabel", e.target.value);
  };

  const handleGaragesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange("garages", e.target.value);
  };

  const handleGardenChange = (checked: boolean) => {
    onFieldChange("hasGarden", checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="propertyType" className="text-sm font-medium">Property Type</label>
            <Select value={formData.propertyType || ""} onValueChange={handleSelectPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="sqft" className="text-sm font-medium">Lot Size (sqft)</label>
            <Input
              id="sqft"
              type="text"
              value={formData.sqft || ""}
              onChange={handleLotSizeChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="livingArea" className="text-sm font-medium">Living Area (sqft)</label>
            <Input
              id="livingArea"
              type="text"
              value={formData.livingArea || ""}
              onChange={handleLivingAreaChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="buildYear" className="text-sm font-medium">Build Year</label>
            <Input
              id="buildYear"
              type="text"
              value={formData.buildYear || ""}
              onChange={handleBuildYearChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
            <Input
              id="bedrooms"
              type="text"
              value={formData.bedrooms || ""}
              onChange={handleBedroomsChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bathrooms" className="text-sm font-medium">Bathrooms</label>
            <Input
              id="bathrooms"
              type="text"
              value={formData.bathrooms || ""}
              onChange={handleBathroomsChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="energyLabel" className="text-sm font-medium">Energy Label</label>
            <Input
              id="energyLabel"
              type="text"
              value={formData.energyLabel || ""}
              onChange={handleEnergyLabelChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="garages" className="text-sm font-medium">Garages</label>
            <Input
              id="garages"
              type="text"
              value={formData.garages || ""}
              onChange={handleInputChange("garages")}
            />
          </div>
          
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox 
              id="hasGarden" 
              checked={formData.hasGarden || false}
              onCheckedChange={handleGardenChange}
            />
            <div className="space-y-1 leading-none">
              <label htmlFor="hasGarden" className="text-sm font-medium">Has Garden</label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
