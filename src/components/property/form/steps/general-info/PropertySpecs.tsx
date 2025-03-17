
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyFormData } from '@/types/property';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function PropertySpecs({ formData, onFieldChange }: PropertySpecsProps) {
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'detached', label: 'Detached' },
    { value: 'semi-detached', label: 'Semi-Detached' },
    { value: 'corner-house', label: 'Corner House' },
    { value: 'terraced-house', label: 'Terraced House' },
    { value: 'farm', label: 'Farm' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        name="propertyType"
        render={() => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <FormControl>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => onFieldChange('propertyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="price"
        render={() => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.price} 
                onChange={(e) => onFieldChange('price', e.target.value)}
                placeholder="Enter price"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="bedrooms"
        render={() => (
          <FormItem>
            <FormLabel>Bedrooms</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.bedrooms} 
                onChange={(e) => onFieldChange('bedrooms', e.target.value)}
                placeholder="Number of bedrooms"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="bathrooms"
        render={() => (
          <FormItem>
            <FormLabel>Bathrooms</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.bathrooms} 
                onChange={(e) => onFieldChange('bathrooms', e.target.value)}
                placeholder="Number of bathrooms"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="sqft"
        render={() => (
          <FormItem>
            <FormLabel>Square Feet</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.sqft} 
                onChange={(e) => onFieldChange('sqft', e.target.value)}
                placeholder="Square footage"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="livingArea"
        render={() => (
          <FormItem>
            <FormLabel>Living Area</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.livingArea} 
                onChange={(e) => onFieldChange('livingArea', e.target.value)}
                placeholder="Living area size"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="buildYear"
        render={() => (
          <FormItem>
            <FormLabel>Year Built</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.buildYear} 
                onChange={(e) => onFieldChange('buildYear', e.target.value)}
                placeholder="Year built"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="garages"
        render={() => (
          <FormItem>
            <FormLabel>Garages</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.garages} 
                onChange={(e) => onFieldChange('garages', e.target.value)}
                placeholder="Number of garages"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="energyLabel"
        render={() => (
          <FormItem>
            <FormLabel>Energy Label</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                value={formData.energyLabel} 
                onChange={(e) => onFieldChange('energyLabel', e.target.value)}
                placeholder="Energy label (A-G)"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="hasGarden"
        render={() => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-6">
            <FormControl>
              <Checkbox 
                checked={formData.hasGarden} 
                onCheckedChange={(checked) => onFieldChange('hasGarden', checked)}
              />
            </FormControl>
            <FormLabel className="font-normal">Has Garden</FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
}
