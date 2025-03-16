
import { PropertyFormData, GeneralInfoData } from "@/types/property";
import { useState, useCallback } from "react";
import { PropertySpecs } from "./general-info/PropertySpecs";
import { BasicDetails } from "./general-info/BasicDetails";
import { DescriptionSection } from "./general-info/DescriptionSection";
import { ImageSelections } from "./general-info/ImageSelections";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

// Define specific type for the sections in generalInfo
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
  const propertyImages = formData.images?.map(img => {
    if (typeof img === 'string') {
      return { url: img, id: img }; // Use URL as ID if string
    }
    return img;
  }) || [];

  // Handle changes to generalInfo
  const handleGeneralInfoChange = useCallback((
    section: GeneralInfoSections, // Use the defined type
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
    }
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  }, [formData.generalInfo, onFieldChange, setPendingChanges]);

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
          featuredImages={formData.featuredImages || []}
          onFeaturedImageSelect={handleFeaturedImageSelect}
          onFeaturedImageToggle={handleFeaturedImageToggle}
        />
      )}
    </div>
  );
}
