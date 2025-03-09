
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertyFeature, PropertyArea, PropertyNearbyPlace, PropertyImage } from "@/types/property";
import { initialFormData } from "@/hooks/property-form/initialFormData";
import { supabase } from "@/integrations/supabase/client";
import { normalizeImages } from "@/utils/imageHelpers";

export function AddPropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddFeature = () => {
    const newFeature: PropertyFeature = {
      id: crypto.randomUUID(),
      description: ""
    };
    
    setFormData(prevFormData => ({
      ...prevFormData,
      features: [...prevFormData.features, newFeature]
    }));
  };

  const handleRemoveFeature = (id: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: prevFormData.features.filter(feature => feature.id !== id)
    }));
  };

  const handleUpdateFeature = (id: string, description: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: prevFormData.features.map(feature => 
        feature.id === id ? { ...feature, description } : feature
      )
    }));
  };

  const handleAddArea = () => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      name: "",
      size: "",
      title: "",
      description: "",
      imageIds: [],
      columns: 2,
      images: []
    };
    
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: [...prevFormData.areas, newArea]
    }));
  };

  const handleRemoveArea = (id: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: prevFormData.areas.filter(area => area.id !== id)
    }));
  };

  const handleUpdateArea = (id: string, field: keyof PropertyArea, value: any) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: prevFormData.areas.map(area => 
        area.id === id ? { ...area, [field]: value } : area
      )
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      const files = Array.from(e.target.files);
      const newImages: PropertyImage[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        if (data.publicUrl) {
          newImages.push({
            id: crypto.randomUUID(),
            url: data.publicUrl,
            filePath
          });
        }
      }

      // Update form data with new images
      setFormData(prevFormData => ({
        ...prevFormData,
        images: [...normalizeImages(prevFormData.images), ...newImages]
      }));

      toast({
        title: "Success",
        description: `Uploaded ${files.length} image(s)`,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prevFormData => {
      const newImages = [...normalizeImages(prevFormData.images)];
      newImages.splice(index, 1);
      return {
        ...prevFormData,
        images: newImages
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            title: formData.title,
            price: formData.price,
            address: formData.address,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            sqft: formData.sqft,
            livingArea: formData.livingArea,
            buildYear: formData.buildYear,
            garages: formData.garages,
            energyLabel: formData.energyLabel,
            hasGarden: formData.hasGarden,
            description: formData.description,
            features: formData.features,
            areas: formData.areas
          }
        ])
        .select();

      if (error) throw error;

      console.log("Property created:", data);
      
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      
      navigate("/properties");
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This function adapter is needed for compatibility
  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                name="sqft"
                value={formData.sqft}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="livingArea">Living Area</Label>
              <Input
                id="livingArea"
                name="livingArea"
                value={formData.livingArea}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buildYear">Build Year</Label>
              <Input
                id="buildYear"
                name="buildYear"
                value={formData.buildYear}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="garages">Garages</Label>
              <Input
                id="garages"
                name="garages"
                value={formData.garages}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="energyLabel">Energy Label</Label>
            <Input
              id="energyLabel"
              name="energyLabel"
              value={formData.energyLabel}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasGarden"
              checked={formData.hasGarden}
              onCheckedChange={(checked) => handleCheckboxChange("hasGarden", checked === true)}
            />
            <Label htmlFor="hasGarden">Has Garden</Label>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
        />
      </div>

      {/* Images section would go here */}
      <div>
        <Label>Images</Label>
        <div className="mt-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {normalizeImages(formData.images).map((image, index) => (
              <div key={image.id || index} className="relative">
                <img
                  src={image.url}
                  alt={`Property ${index}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Property"}
      </Button>
    </form>
  );
}
