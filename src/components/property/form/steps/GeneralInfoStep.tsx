
import { BasicDetails } from "./general-info/BasicDetails";
import { PropertySpecs } from "./general-info/PropertySpecs";
import { DescriptionSection } from "./general-info/DescriptionSection";
import { ImageSelections } from "./general-info/ImageSelections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertyFormData } from "@/types/property";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onSetFeaturedImage?: (url: string | null) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
  isUploading?: boolean;
}

export function GeneralInfoStep({ 
  formData, 
  onFieldChange,
  onSetFeaturedImage,
  handleSetFeaturedImage,
  handleToggleGridImage,
  isUploading = false
}: GeneralInfoStepProps) {
  // Use either the provided handler or pass through to onFieldChange
  const setFeaturedImage = handleSetFeaturedImage || onSetFeaturedImage || ((url: string | null) => {
    onFieldChange('featuredImage', url);
  });
  
  // Default grid image toggle if not provided
  const toggleGridImage = handleToggleGridImage || ((url: string) => {
    const currentGridImages = [...(formData.gridImages || [])];
    
    if (currentGridImages.includes(url)) {
      onFieldChange('gridImages', currentGridImages.filter(i => i !== url));
    } else {
      if (currentGridImages.length >= 4) return;
      onFieldChange('gridImages', [...currentGridImages, url]);
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicDetails 
            formData={formData} 
            onFieldChange={onFieldChange} 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertySpecs 
            formData={formData} 
            onFieldChange={onFieldChange} 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionSection 
            formData={formData} 
            onFieldChange={onFieldChange} 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Featured & Grid Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageSelections
            formData={formData}
            onFieldChange={onFieldChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
