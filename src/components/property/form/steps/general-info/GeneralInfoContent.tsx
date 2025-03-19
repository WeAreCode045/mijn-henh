
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GeneralInfoContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function GeneralInfoContent({ formData, onFieldChange }: GeneralInfoContentProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => onFieldChange('title', e.target.value)}
              placeholder="Enter property title"
            />
          </div>
          
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price || ''}
              onChange={(e) => onFieldChange('price', e.target.value)}
              placeholder="Enter price"
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => onFieldChange('address', e.target.value)}
              placeholder="Enter property address"
            />
          </div>
          
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Input
              id="propertyType"
              value={formData.propertyType || ''}
              onChange={(e) => onFieldChange('propertyType', e.target.value)}
              placeholder="e.g., House, Apartment, Villa"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              value={formData.bedrooms || ''}
              onChange={(e) => onFieldChange('bedrooms', e.target.value)}
              placeholder="Number of bedrooms"
            />
          </div>
          
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              value={formData.bathrooms || ''}
              onChange={(e) => onFieldChange('bathrooms', e.target.value)}
              placeholder="Number of bathrooms"
            />
          </div>
          
          <div>
            <Label htmlFor="sqft">Square Feet</Label>
            <Input
              id="sqft"
              value={formData.sqft || ''}
              onChange={(e) => onFieldChange('sqft', e.target.value)}
              placeholder="Total area in sq ft"
            />
          </div>
          
          <div>
            <Label htmlFor="livingArea">Living Area</Label>
            <Input
              id="livingArea"
              value={formData.livingArea || ''}
              onChange={(e) => onFieldChange('livingArea', e.target.value)}
              placeholder="Living area in sq ft"
            />
          </div>
          
          <div>
            <Label htmlFor="buildYear">Year Built</Label>
            <Input
              id="buildYear"
              value={formData.buildYear || ''}
              onChange={(e) => onFieldChange('buildYear', e.target.value)}
              placeholder="Construction year"
            />
          </div>
          
          <div>
            <Label htmlFor="garages">Garages</Label>
            <Input
              id="garages"
              value={formData.garages || ''}
              onChange={(e) => onFieldChange('garages', e.target.value)}
              placeholder="Number of garages"
            />
          </div>
          
          <div>
            <Label htmlFor="energyLabel">Energy Label</Label>
            <Input
              id="energyLabel"
              value={formData.energyLabel || ''}
              onChange={(e) => onFieldChange('energyLabel', e.target.value)}
              placeholder="Energy efficiency rating"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription || ''}
              onChange={(e) => onFieldChange('shortDescription', e.target.value)}
              placeholder="Brief description for listings"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => onFieldChange('description', e.target.value)}
              placeholder="Detailed property description"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
