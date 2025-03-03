
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
  isUploading?: boolean;
}

export function GeneralInfoStep({ 
  formData, 
  onFieldChange,
  onSetFeaturedImage,
  isUploading = false
}: GeneralInfoStepProps) {
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
