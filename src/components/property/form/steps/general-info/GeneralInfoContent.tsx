
import React from "react";
import { PropertyFormData } from "@/types/property";

interface GeneralInfoContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function GeneralInfoContent({ formData, onFieldChange }: GeneralInfoContentProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">General Information</h3>
      
      {/* Basic Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            id="title"
            type="text"
            value={formData.title || ''}
            onChange={(e) => onFieldChange('title', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium">Price</label>
          <input
            id="price"
            type="text"
            value={formData.price || ''}
            onChange={(e) => onFieldChange('price', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="propertyType" className="block text-sm font-medium">Property Type</label>
          <select
            id="propertyType"
            value={formData.propertyType || ''}
            onChange={(e) => onFieldChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>
      
      {/* Property Specifications */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="bedrooms" className="block text-sm font-medium">Bedrooms</label>
          <input
            id="bedrooms"
            type="text"
            value={formData.bedrooms || ''}
            onChange={(e) => onFieldChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="bathrooms" className="block text-sm font-medium">Bathrooms</label>
          <input
            id="bathrooms"
            type="text"
            value={formData.bathrooms || ''}
            onChange={(e) => onFieldChange('bathrooms', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sqft" className="block text-sm font-medium">Square Feet</label>
          <input
            id="sqft"
            type="text"
            value={formData.sqft || ''}
            onChange={(e) => onFieldChange('sqft', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="livingArea" className="block text-sm font-medium">Living Area</label>
          <input
            id="livingArea"
            type="text"
            value={formData.livingArea || ''}
            onChange={(e) => onFieldChange('livingArea', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="buildYear" className="block text-sm font-medium">Year Built</label>
          <input
            id="buildYear"
            type="text"
            value={formData.buildYear || ''}
            onChange={(e) => onFieldChange('buildYear', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="garages" className="block text-sm font-medium">Garages</label>
          <input
            id="garages"
            type="text"
            value={formData.garages || ''}
            onChange={(e) => onFieldChange('garages', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="shortDescription" className="block text-sm font-medium">Short Description</label>
        <textarea
          id="shortDescription"
          value={formData.shortDescription || ''}
          onChange={(e) => onFieldChange('shortDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    </div>
  );
}
