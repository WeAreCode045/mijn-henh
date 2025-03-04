
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BasicDetails } from "./general-info/BasicDetails";
import { DescriptionSection } from "./general-info/DescriptionSection";
import { PropertySpecs } from "./general-info/PropertySpecs";
import { ImageSelections } from "./general-info/ImageSelections";
import { useState } from "react";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading
}: GeneralInfoStepProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof PropertyFormData, value);
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    onFieldChange(name as keyof PropertyFormData, checked);
  };

  const handleFeaturedImageSelect = (url: string | null) => {
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
    }
  };

  const handleFeaturedImageToggle = (url: string) => {
    if (handleToggleFeaturedImage) {
      handleToggleFeaturedImage(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Details */}
      <BasicDetails 
        formData={formData}
        onFieldChange={onFieldChange}
      />
      
      {/* Property Specifications */}
      <PropertySpecs 
        formData={formData} 
        onFieldChange={onFieldChange}
      />
      
      {/* Description Section */}
      <DescriptionSection 
        formData={formData}
        onFieldChange={onFieldChange}
      />
      
      {/* Advanced Fields Toggle */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Fields
      </Button>
      
      {/* Advanced Fields */}
      {showAdvanced && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Advanced Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="livingArea">Living Area (m²)</Label>
                <Input
                  id="livingArea"
                  name="livingArea"
                  placeholder="Living Area"
                  value={formData.livingArea || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buildYear">Build Year</Label>
                <Input
                  id="buildYear"
                  name="buildYear"
                  placeholder="Build Year"
                  value={formData.buildYear || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="garages">Garages</Label>
                <Input
                  id="garages"
                  name="garages"
                  placeholder="Garages"
                  value={formData.garages || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="energyLabel">Energy Label</Label>
                <Input
                  id="energyLabel"
                  name="energyLabel"
                  placeholder="Energy Label"
                  value={formData.energyLabel || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasGarden"
                  checked={formData.hasGarden || false}
                  onCheckedChange={(checked) => handleSwitchChange('hasGarden', checked)}
                />
                <Label htmlFor="hasGarden">Has Garden</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Image Selections - Only display if there are images available */}
      {formData.images && formData.images.length > 0 && (
        <ImageSelections
          images={formData.images}
          featuredImage={formData.featuredImage || null}
          featuredImages={formData.featuredImages || []}
          onFeaturedImageSelect={handleFeaturedImageSelect}
          onFeaturedImageToggle={handleFeaturedImageToggle}
          maxFeaturedImages={4}
        />
      )}
    </div>
  );
}
