
import React, { useState, ChangeEvent, useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAreaPhotos } from "@/hooks/images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "@/hooks/images/usePropertyFloorplans";
import { useToast } from "@/components/ui/use-toast";

interface AddPropertyFormProps {
  propertyId?: string;
}

export function AddPropertyForm({ propertyId }: AddPropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // Load property data
  const { formData, setFormData } = usePropertyForm(propertyId);

  // Load property image handlers
  const { 
    handleImageUpload, 
    handleRemoveImage, 
    isUploading, 
    handleAreaPhotosUpload, 
    handleFloorplanUpload, 
    handleRemoveAreaPhoto, 
    handleRemoveFloorplan, 
    handleSetFeaturedImage, 
    handleToggleFeaturedImage,
    images 
  } = usePropertyImages(formData, setFormData);

  // Property content management
  const handleAddFeature = useCallback(() => {
    setFormData(prevFormData => {
      const newFeature = {
        id: Date.now().toString(),
        description: ''
      };
      return {
        ...prevFormData,
        features: [...(prevFormData.features || []), newFeature]
      };
    });
  }, [setFormData]);

  const handleRemoveFeature = useCallback((id: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: (prevFormData.features || []).filter(feature => feature.id !== id)
    }));
  }, [setFormData]);

  const handleUpdateFeature = useCallback((id: string, description: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: (prevFormData.features || []).map(feature =>
        feature.id === id ? { ...feature, description } : feature
      )
    }));
  }, [setFormData]);

  // Technical item management functions
  const handleAddTechnicalItem = useCallback(() => {
    setFormData(prevFormData => {
      const newItem = {
        id: Date.now().toString(),
        title: '',
        size: '',
        description: '',
        floorplanId: null
      };
      return {
        ...prevFormData,
        technicalItems: [...(prevFormData.technicalItems || []), newItem]
      };
    });
  }, [setFormData]);

  // Modified to accept either number or string parameter
  const handleRemoveTechnicalItem = useCallback((idOrIndex: number | string) => {
    setFormData(prevFormData => {
      if (typeof idOrIndex === 'number') {
        // Handle removal by index
        const updatedItems = [...(prevFormData.technicalItems || [])];
        updatedItems.splice(idOrIndex, 1);
        return {
          ...prevFormData,
          technicalItems: updatedItems
        };
      } else {
        // Handle removal by id
        return {
          ...prevFormData,
          technicalItems: (prevFormData.technicalItems || []).filter(item => item.id !== idOrIndex)
        };
      }
    });
  }, [setFormData]);

  const handleUpdateTechnicalItem = useCallback((id: string, field: any, value: any) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      technicalItems: (prevFormData.technicalItems || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  }, [setFormData]);

  const handleAddArea = useCallback(() => {
    setFormData(prevFormData => {
      const newArea = {
        id: Date.now().toString(),
        title: '',
        description: '',
        imageIds: [],
        columns: 2
      };
      return {
        ...prevFormData,
        areas: [...(prevFormData.areas || []), newArea]
      };
    });
  }, [setFormData]);

  const handleRemoveArea = useCallback((id: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: (prevFormData.areas || []).filter(area => area.id !== id)
    }));
  }, [setFormData]);

  const handleUpdateArea = useCallback((id: string, field: any, value: any) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: (prevFormData.areas || []).map(area =>
        area.id === id ? { ...area, [field]: value } : area
      )
    }));
  }, [setFormData]);

  const handleAreaImageUpload = async (areaId: string, files: FileList) => {
    // Implementation for handling area image uploads
  };

  const handleAreaImageRemove = (areaId: string, imageId: string) => {
    // Implementation for handling area image removal
  };

  const handleAreaImagesSelect = (areaId: string, imageIds: string[]) => {
    // Implementation for handling area image selection
  };

  const handleMapImageDelete = async () => {
    // Implementation for handling map image deletion
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
      
      <PropertyFormContent
        step={currentStep}
        formData={formData}
        onFieldChange={(field, value) => setFormData(prevFormData => ({ ...prevFormData, [field]: value }))}
        onAddFeature={handleAddFeature}
        onRemoveFeature={handleRemoveFeature}
        onUpdateFeature={handleUpdateFeature}
        onAddArea={handleAddArea}
        onRemoveArea={handleRemoveArea}
        onUpdateArea={handleUpdateArea}
        onAreaImageUpload={handleAreaImageUpload}
        onAreaImageRemove={handleAreaImageRemove}
        onAreaImagesSelect={handleAreaImagesSelect}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
        handleAreaPhotosUpload={handleAreaPhotosUpload}
        handleFloorplanUpload={handleFloorplanUpload}
        handleRemoveAreaPhoto={handleRemoveAreaPhoto}
        handleRemoveFloorplan={handleRemoveFloorplan}
        handleSetFeaturedImage={handleSetFeaturedImage}
        handleToggleFeaturedImage={handleToggleFeaturedImage}
        onAddTechnicalItem={handleAddTechnicalItem}
        onRemoveTechnicalItem={handleRemoveTechnicalItem}
        handleMapImageDelete={handleMapImageDelete}
        isUploading={isUploading}
      />
    </div>
  );
}
