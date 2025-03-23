
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EditButton } from "@/components/property/content/EditButton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GeneralPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function GeneralPage({
  formData,
  onFieldChange,
  setPendingChanges
}: GeneralPageProps) {
  const { toast } = useToast();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [isSavingSpecs, setIsSavingSpecs] = useState(false);
  
  // Local form state
  const [description, setDescription] = useState(formData.description || '');
  const [shortDescription, setShortDescription] = useState(formData.shortDescription || '');
  const [propertyType, setPropertyType] = useState(formData.propertyType || '');
  const [bedrooms, setBedrooms] = useState(formData.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(formData.bathrooms || 0);
  const [area, setArea] = useState(formData.area || 0);
  const [price, setPrice] = useState(formData.price || '');
  const [featured, setFeatured] = useState(formData.featured || false);
  
  // Property types
  const propertyTypes = [
    "House", "Apartment", "Townhouse", "Condo", "Land", "Commercial"
  ];

  // Save description changes
  const saveDescription = async () => {
    if (!formData.id) return;
    
    setIsSavingDescription(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          description: description,
          shortDescription: shortDescription
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Update parent state
      onFieldChange('description', description);
      onFieldChange('shortDescription', shortDescription);
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "Property description updated successfully",
      });
      
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Error updating description:", error);
      toast({
        title: "Error",
        description: "Could not update property description",
        variant: "destructive",
      });
    } finally {
      setIsSavingDescription(false);
    }
  };
  
  // Save specs changes
  const saveSpecs = async () => {
    if (!formData.id) return;
    
    setIsSavingSpecs(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          propertyType: propertyType,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          area: area,
          price: price,
          featured: featured
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Update parent state
      onFieldChange('propertyType', propertyType);
      onFieldChange('bedrooms', bedrooms);
      onFieldChange('bathrooms', bathrooms);
      onFieldChange('area', area);
      onFieldChange('price', price);
      onFieldChange('featured', featured);
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "Property specifications updated successfully",
      });
      
      setIsEditingSpecs(false);
    } catch (error) {
      console.error("Error updating specs:", error);
      toast({
        title: "Error",
        description: "Could not update property specifications",
        variant: "destructive",
      });
    } finally {
      setIsSavingSpecs(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Description</CardTitle>
          <EditButton
            isEditing={isEditingDescription}
            onToggle={() => setIsEditingDescription(!isEditingDescription)}
            onSave={saveDescription}
            isSaving={isSavingDescription}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingDescription ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  placeholder="Enter a brief summary of the property (displayed in listings)"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter a detailed description of the property"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[200px]"
                  rows={8}
                />
              </div>
            </>
          ) : (
            <>
              {shortDescription ? (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Short Description</h3>
                  <p>{shortDescription}</p>
                </div>
              ) : null}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Description</h3>
                <div className="whitespace-pre-wrap">{description || 'No description added yet.'}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Key Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Key Information</CardTitle>
          <EditButton
            isEditing={isEditingSpecs}
            onToggle={() => setIsEditingSpecs(!isEditingSpecs)}
            onSave={saveSpecs}
            isSaving={isSavingSpecs}
          />
        </CardHeader>
        <CardContent>
          {isEditingSpecs ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="property-type">Type</Label>
                <Select
                  value={propertyType}
                  onValueChange={setPropertyType}
                >
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input 
                  id="bedrooms" 
                  type="number" 
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input 
                  id="bathrooms" 
                  type="number" 
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  min="0"
                  step="0.5"
                />
              </div>
              
              <div>
                <Label htmlFor="area">Area (m²)</Label>
                <Input 
                  id="area" 
                  type="number" 
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="€ 0"
                />
              </div>
              
              <div className="col-span-2 flex items-center space-x-2 pt-2">
                <Switch 
                  id="featured" 
                  checked={featured}
                  onCheckedChange={setFeatured}
                />
                <Label htmlFor="featured">Featured Property</Label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <p>{propertyType || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                <p>{price || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Bedrooms</h3>
                <p>{bedrooms || '0'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Bathrooms</h3>
                <p>{bathrooms || '0'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Area</h3>
                <p>{area ? `${area} m²` : 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Featured</h3>
                <p>{featured ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
