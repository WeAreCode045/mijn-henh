
import React from "react";
import { PropertyStepForm } from "../PropertyStepForm";
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface GeneralInfoFormProps {
  formData: PropertyFormData;
  step: number;
  onStepChange: (step: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function GeneralInfoForm({
  formData,
  step,
  onStepChange,
  onFieldChange,
  onSubmit,
  isSubmitting = false
}: GeneralInfoFormProps) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={formData.title || ''}
                onChange={(e) => onFieldChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price"
                value={formData.price || ''}
                onChange={(e) => onFieldChange('price', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                value={formData.address || ''}
                onChange={(e) => onFieldChange('address', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input 
                id="bedrooms"
                value={formData.bedrooms || ''}
                onChange={(e) => onFieldChange('bedrooms', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input 
                id="bathrooms"
                value={formData.bathrooms || ''}
                onChange={(e) => onFieldChange('bathrooms', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input 
                id="sqft"
                value={formData.sqft || ''}
                onChange={(e) => onFieldChange('sqft', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description || ''}
              onChange={(e) => onFieldChange('description', e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
      </Card>
    </PropertyStepForm>
  );
}
