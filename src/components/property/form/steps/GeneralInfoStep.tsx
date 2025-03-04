
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star, Grid } from "lucide-react";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  handleToggleGridImage
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

  // Function to handle featured image selection
  const handleFeaturedImageSelect = (url: string) => {
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
    }
  };

  // Function to handle grid image selection
  const handleGridImageSelect = (url: string) => {
    if (handleToggleGridImage) {
      handleToggleGridImage(url);
    }
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
      
      {/* Image Selection Section - Only have selector dropdowns, not the grid */}
      {formData.images && formData.images.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Featured Image Selection */}
              <div>
                <Label htmlFor="featuredImage">Featured Image</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Select 
                    value={formData.featuredImage || ""} 
                    onValueChange={handleFeaturedImageSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a featured image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {formData.images.map((image, index) => {
                        const imageUrl = typeof image === 'string' ? image : image.url;
                        return (
                          <SelectItem key={index} value={imageUrl}>
                            Image {index + 1}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  {formData.featuredImage && (
                    <div className="w-20 h-20 relative border rounded overflow-hidden">
                      <img 
                        src={formData.featuredImage} 
                        alt="Featured" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-1">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Grid Images Selection */}
              <div>
                <Label>Grid Images (max 4)</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.images.map((image, index) => {
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    const isInGrid = formData.gridImages?.includes(imageUrl);
                    
                    return (
                      <Button
                        key={index}
                        type="button"
                        variant={isInGrid ? "secondary" : "outline"}
                        className="flex items-center gap-2 h-auto py-2"
                        onClick={() => handleGridImageSelect(imageUrl)}
                      >
                        <div className="w-10 h-10 relative border rounded overflow-hidden">
                          <img 
                            src={imageUrl} 
                            alt={`Image ${index + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        {isInGrid && <Grid className="h-4 w-4 text-primary" />}
                      </Button>
                    );
                  })}
                </div>
                
                {formData.gridImages && formData.gridImages.length > 0 && (
                  <div className="mt-4">
                    <Label>Selected Grid Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {formData.gridImages.map((url, index) => (
                        <div key={index} className="relative border rounded overflow-hidden aspect-square">
                          <img src={url} alt={`Grid ${index + 1}`} className="w-full h-full object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => handleGridImageSelect(url)}
                          >
                            <Grid className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
