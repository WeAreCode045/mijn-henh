
import { PropertyFormData, GeneralInfoData, PropertyImage } from "@/types/property";
import { useState } from "react";
import { PropertySpecs } from "./PropertySpecs";
import { BasicDetails } from "./BasicDetails";
import { DescriptionSection } from "./DescriptionSection";
import { ImageSelections } from "./ImageSelections";
import { toPropertyImage, toPropertyImageArray, extractImageUrls } from "@/utils/imageTypeConverters";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

// Define the allowed sections for the generalInfo object
type GeneralInfoSections = 'propertyDetails' | 'description' | 'keyInformation';

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading,
  setPendingChanges
}: GeneralInfoStepProps) {
  // Initialize generalInfo if it doesn't exist
  if (!formData.generalInfo) {
    formData.generalInfo = {
      propertyDetails: {
        title: formData.title || '',
        price: formData.price || '',
        address: formData.address || '',
        objectId: formData.object_id || '',
      },
      description: {
        shortDescription: formData.shortDescription || '',
        fullDescription: formData.description || '',
      },
      keyInformation: {
        buildYear: formData.buildYear || '',
        lotSize: formData.sqft || '',
        livingArea: formData.livingArea || '',
        bedrooms: formData.bedrooms || '',
        bathrooms: formData.bathrooms || '',
        energyClass: formData.energyLabel || '',
        garages: formData.garages || '',
        hasGarden: formData.hasGarden || false,
      }
    };
  }

  const handleFeaturedImageSelect = (url: string | null) => {
    console.log("Featured image selected in GeneralInfoStep:", url);
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };

  const handleFeaturedImageToggle = (url: string) => {
    console.log("Featured image toggled in GeneralInfoStep:", url);
    if (handleToggleFeaturedImage) {
      handleToggleFeaturedImage(url);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };

  // Convert images to PropertyImage[] format
  const propertyImages = formData.images ? toPropertyImageArray(formData.images) : [];

  // Handle changes to generalInfo
  const handleGeneralInfoChange = (
    section: GeneralInfoSections,
    field: string,
    value: any
  ) => {
    if (!formData.generalInfo) return;
    
    const updatedGeneralInfo = {
      ...formData.generalInfo,
      [section]: {
        ...formData.generalInfo[section],
        [field]: value
      }
    };
    
    // Update the generalInfo field
    onFieldChange('generalInfo', updatedGeneralInfo);
    
    // Also update the individual fields for backward compatibility
    if (section === 'propertyDetails') {
      if (field === 'title') onFieldChange('title', value);
      if (field === 'price') onFieldChange('price', value);
      if (field === 'address') onFieldChange('address', value);
      if (field === 'objectId') onFieldChange('object_id', value);
    } else if (section === 'description') {
      if (field === 'shortDescription') onFieldChange('shortDescription', value);
      if (field === 'fullDescription') onFieldChange('description', value);
    } else if (section === 'keyInformation') {
      if (field === 'buildYear') onFieldChange('buildYear', value);
      if (field === 'lotSize') onFieldChange('sqft', value);
      if (field === 'livingArea') onFieldChange('livingArea', value);
      if (field === 'bedrooms') onFieldChange('bedrooms', value);
      if (field === 'bathrooms') onFieldChange('bathrooms', value);
      if (field === 'energyClass') onFieldChange('energyLabel', value);
      if (field === 'garages') onFieldChange('garages', value);
      if (field === 'hasGarden') onFieldChange('hasGarden', value);
    }
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Basic Details (Title, Price, Address, Object ID) */}
      <BasicDetails 
        formData={formData} 
        onFieldChange={onFieldChange}
        onGeneralInfoChange={handleGeneralInfoChange}
      />

      {/* 2. Property Description */}
      <DescriptionSection 
        formData={formData}
        onFieldChange={onFieldChange}
        onGeneralInfoChange={handleGeneralInfoChange}
        setPendingChanges={setPendingChanges}
      />
      
      {/* 3. Key Information */}
      <PropertySpecs 
        formData={formData} 
        onFieldChange={onFieldChange}
        onGeneralInfoChange={handleGeneralInfoChange}
      />

      {/* 4. Image Selections */}
      {formData.images && formData.images.length > 0 && (
        <ImageSelections
          images={propertyImages}
          featuredImage={formData.featuredImage || null}
          featuredImages={toPropertyImageArray(formData.featuredImages || [])}
          onFeaturedImageSelect={handleFeaturedImageSelect}
          onFeaturedImageToggle={handleFeaturedImageToggle}
        />
      )}
    </div>
  );
}
