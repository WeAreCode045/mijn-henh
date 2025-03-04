import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { useState } from "react";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
  isUploading?: boolean;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleImageUpload,
  handleRemoveImage,
  handleSetFeaturedImage,
  handleToggleGridImage,
  isUploading
}: GeneralInfoStepProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof PropertyFormData, value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFieldChange(name as keyof PropertyFormData, checked);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  placeholder="Enter property title"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleChange}
                  placeholder="e.g. €450,000"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Full property address"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms || ""}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms || ""}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sqft">Total Area (m²)</Label>
                  <Input
                    id="sqft"
                    name="sqft"
                    value={formData.sqft || ""}
                    onChange={handleChange}
                    placeholder="e.g. 150"
                  />
                </div>
                
                <div>
                  <Label htmlFor="livingArea">Living Area (m²)</Label>
                  <Input
                    id="livingArea"
                    name="livingArea"
                    value={formData.livingArea || ""}
                    onChange={handleChange}
                    placeholder="e.g. 120"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buildYear">Year Built</Label>
                  <Input
                    id="buildYear"
                    name="buildYear"
                    value={formData.buildYear || ""}
                    onChange={handleChange}
                    placeholder="e.g. 2010"
                  />
                </div>
                
                <div>
                  <Label htmlFor="garages">Garages</Label>
                  <Input
                    id="garages"
                    name="garages"
                    value={formData.garages || ""}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="showAdvanced" 
                checked={showAdvanced} 
                onCheckedChange={(checked) => setShowAdvanced(checked as boolean)}
              />
              <Label htmlFor="showAdvanced" className="cursor-pointer">Show Advanced Options</Label>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="energyLabel">Energy Label</Label>
                  <Input
                    id="energyLabel"
                    name="energyLabel"
                    value={formData.energyLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. A, B, C..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasGarden" 
                    name="hasGarden"
                    checked={formData.hasGarden || false} 
                    onCheckedChange={(checked) => onFieldChange("hasGarden", checked as boolean)}
                  />
                  <Label htmlFor="hasGarden" className="cursor-pointer">Has Garden</Label>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div>
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Detailed description of the property"
              className="min-h-[150px]"
            />
          </div>
        </CardContent>
      </Card>
      
      {handleImageUpload && handleRemoveImage && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label>Property Images</Label>
              <ImageUploader 
                onUpload={handleImageUpload} 
                isUploading={isUploading}
                label="Upload Images"
              />
              
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <ImagePreview
                      key={index}
                      url={image.url}
                      onRemove={() => handleRemoveImage(index)}
                      isFeatured={formData.featuredImage === image.url}
                      onSetFeatured={handleSetFeaturedImage ? () => handleSetFeaturedImage(image.url) : undefined}
                      isInGrid={formData.gridImages?.includes(image.url)}
                      onToggleGrid={handleToggleGridImage ? () => handleToggleGridImage(image.url) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
