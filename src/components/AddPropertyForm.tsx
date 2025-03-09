
// Import needed modules and components
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFeature, PropertyFormData } from "@/types/property";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { initialFormData } from "@/hooks/property-form/initialFormData";
import { usePropertyFormSubmit } from "@/hooks/property-form/usePropertyFormSubmit";

const AddPropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit } = usePropertyFormSubmit();

  // Property image handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle image selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      // Add the image to formData
      setFormData(prevFormData => ({
        ...prevFormData,
        images: [...prevFormData.images, { id: crypto.randomUUID(), url: urlData.publicUrl }]
      }));

      // Clear selected file and preview
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index)
    }));
  };

  // Feature management
  const handleAddFeature = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: [
        ...prevFormData.features,
        { id: crypto.randomUUID(), description: '' }
      ]
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

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await handleSubmit(e, formData, true);
      
      if (result) {
        navigate('/properties');
        toast.success('Property added successfully');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error('Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Special handling for checkbox inputs
    if (type === 'checkbox') {
      const checkboxInput = e.target as HTMLInputElement;
      setFormData(prevData => ({
        ...prevData,
        [name]: checkboxInput.checked
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Custom field change handler to match the property form pattern
  const handlePropertyFieldChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFieldChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFieldChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleFieldChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <Label htmlFor="sqft">Square Feet</Label>
                <Input
                  id="sqft"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <Label htmlFor="livingArea">Living Area</Label>
                <Input
                  id="livingArea"
                  name="livingArea"
                  value={formData.livingArea}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="buildYear">Build Year</Label>
                <Input
                  id="buildYear"
                  name="buildYear"
                  value={formData.buildYear}
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <Label htmlFor="garages">Garages</Label>
                <Input
                  id="garages"
                  name="garages"
                  value={formData.garages}
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <Label htmlFor="energyLabel">Energy Label</Label>
                <Input
                  id="energyLabel"
                  name="energyLabel"
                  value={formData.energyLabel}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasGarden"
                name="hasGarden"
                checked={formData.hasGarden}
                onChange={handleFieldChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="hasGarden">Has Garden</Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFieldChange}
              rows={6}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyFeatures
              features={formData.features}
              onAdd={handleAddFeature}
              onRemove={handleRemoveFeature}
              onUpdate={handleUpdateFeature}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="property-image">Select Property Image</Label>
                <Input
                  id="property-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm mb-1">Preview:</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-xs rounded border"
                    />
                  </div>
                )}
                
                <Button
                  type="button"
                  disabled={!selectedFile || uploading}
                  onClick={handleImageUpload}
                  className="w-fit mt-2"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
              
              {formData.images.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Uploaded Images:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={'url' in image ? image.url : image.toString()}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/properties')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Property'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
