
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditButton } from "@/components/property/content/EditButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(formData.title || '');
  const [price, setPrice] = useState(formData.price || '');
  const [address, setAddress] = useState(formData.address || '');
  const [bedrooms, setBedrooms] = useState(formData.bedrooms || '');
  const [bathrooms, setBathrooms] = useState(formData.bathrooms || '');
  const [sqft, setSqft] = useState(formData.sqft || '');
  const [livingArea, setLivingArea] = useState(formData.livingArea || '');
  const [buildYear, setBuildYear] = useState(formData.buildYear || '');
  const [garages, setGarages] = useState(formData.garages || '');
  const [energyLabel, setEnergyLabel] = useState(formData.energyLabel || '');
  const [description, setDescription] = useState(formData.description || '');
  
  const saveGeneralInfo = async () => {
    if (!formData.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          title,
          price,
          address,
          bedrooms,
          bathrooms,
          sqft,
          livingArea,
          buildYear,
          garages,
          energyLabel
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Update parent state
      onFieldChange('title', title);
      onFieldChange('price', price);
      onFieldChange('address', address);
      onFieldChange('bedrooms', bedrooms);
      onFieldChange('bathrooms', bathrooms);
      onFieldChange('sqft', sqft);
      onFieldChange('livingArea', livingArea);
      onFieldChange('buildYear', buildYear);
      onFieldChange('garages', garages);
      onFieldChange('energyLabel', energyLabel);
      
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "General information updated successfully",
      });
      
      setIsEditingGeneral(false);
    } catch (error) {
      console.error("Error updating general information:", error);
      toast({
        title: "Error",
        description: "Could not update general information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const saveDescription = async () => {
    if (!formData.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          description
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Update parent state
      onFieldChange('description', description);
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
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* General Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">General Information</CardTitle>
          <EditButton
            isEditing={isEditingGeneral}
            onToggle={() => setIsEditingGeneral(!isEditingGeneral)}
            onSave={saveGeneralInfo}
            isSaving={isSaving && isEditingGeneral}
          />
        </CardHeader>
        <CardContent>
          {isEditingGeneral ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter property title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="Number of bedrooms"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="Number of bathrooms"
                  />
                </div>
                <div>
                  <Label htmlFor="garages">Garages</Label>
                  <Input
                    id="garages"
                    type="number"
                    value={garages}
                    onChange={(e) => setGarages(e.target.value)}
                    placeholder="Number of garages"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sqft">Total Area (sqft)</Label>
                  <Input
                    id="sqft"
                    type="number"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    placeholder="Total square footage"
                  />
                </div>
                <div>
                  <Label htmlFor="livingArea">Living Area (sqft)</Label>
                  <Input
                    id="livingArea"
                    type="number"
                    value={livingArea}
                    onChange={(e) => setLivingArea(e.target.value)}
                    placeholder="Living area square footage"
                  />
                </div>
                <div>
                  <Label htmlFor="buildYear">Build Year</Label>
                  <Input
                    id="buildYear"
                    value={buildYear}
                    onChange={(e) => setBuildYear(e.target.value)}
                    placeholder="Year built"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="energyLabel">Energy Label</Label>
                <Select 
                  value={energyLabel}
                  onValueChange={(value) => setEnergyLabel(value)}
                >
                  <SelectTrigger id="energyLabel">
                    <SelectValue placeholder="Select energy label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="A++">A++</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Title</h3>
                <p>{formData.title || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Price</h3>
                <p>{formData.price || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Address</h3>
                <p>{formData.address || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Bedrooms</h3>
                <p>{formData.bedrooms || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Bathrooms</h3>
                <p>{formData.bathrooms || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Garages</h3>
                <p>{formData.garages || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Total Area (sqft)</h3>
                <p>{formData.sqft || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Living Area (sqft)</h3>
                <p>{formData.livingArea || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Build Year</h3>
                <p>{formData.buildYear || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Energy Label</h3>
                <p>{formData.energyLabel || "Not specified"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Description</CardTitle>
          <EditButton
            isEditing={isEditingDescription}
            onToggle={() => setIsEditingDescription(!isEditingDescription)}
            onSave={saveDescription}
            isSaving={isSaving && isEditingDescription}
          />
        </CardHeader>
        <CardContent>
          {isEditingDescription ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter property description"
              rows={10}
            />
          ) : (
            <div>
              {description ? (
                <p className="whitespace-pre-wrap">{description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description added yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
