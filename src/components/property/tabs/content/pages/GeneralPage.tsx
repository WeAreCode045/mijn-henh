
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentSaveButton } from "@/components/property/form/steps/common/ContentSaveButton";

interface GeneralPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
  onSubmit?: () => void;
  isSaving?: boolean;
}

export function GeneralPage({ 
  formData, 
  onFieldChange,
  setPendingChanges,
  onSubmit,
  isSaving = false
}: GeneralPageProps) {
  
  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  const handleSave = () => {
    if (onSubmit) {
      onSubmit();
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter property title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter property description"
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription || ''}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              placeholder="Enter a brief description (shown in listings)"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Enter price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Input
                id="propertyType"
                value={formData.propertyType || ''}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                placeholder="Enter property type (e.g. House, Apartment)"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                value={formData.bedrooms || ''}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="Number of bedrooms"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                value={formData.bathrooms || ''}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="Number of bathrooms"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                value={formData.sqft || ''}
                onChange={(e) => handleInputChange('sqft', e.target.value)}
                placeholder="Square footage"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <ContentSaveButton onSave={handleSave} isSaving={isSaving} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
