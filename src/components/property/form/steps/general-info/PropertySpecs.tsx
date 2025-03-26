
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function PropertySpecs({ formData, onFieldChange, setPendingChanges }: PropertySpecsProps) {
  const [initialPropertyType, setInitialPropertyType] = useState<string | null>(null);
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (formData.propertyType && initialPropertyType === null) {
      setInitialPropertyType(formData.propertyType);
    }
  }, [formData.propertyType, initialPropertyType]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const saveToDatabase = async (field: keyof PropertyFormData, value: any) => {
    if (!formData.id) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ [field]: value })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      toast({
        title: "Saved",
        description: `${field} updated successfully`,
      });
    } catch (error) {
      console.error(`Error saving ${field} to database:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${field}`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleInputBlur = (field: keyof PropertyFormData, value: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      await saveToDatabase(field, value);
      
      if (setPendingChanges) {
        setPendingChanges(false);
      }
    }, 2000);
  };
  
  const handleSwitchChange = async (field: keyof PropertyFormData, checked: boolean) => {
    onFieldChange(field, checked);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      await saveToDatabase(field, checked);
      
      if (setPendingChanges) {
        setPendingChanges(false);
      }
    }, 2000);
  };

  const propertyTypes = [
    "House", "Apartment", "Townhouse", "Condo", "Land", "Commercial"
  ];
  
  const energyLabels = [
    "A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"
  ];

  // Ensure we have safe values for selects
  const safePropertyType = formData.propertyType || "not_specified";
  const safeEnergyLabel = formData.energyLabel || "none";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Key Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="col-span-2">
            <Label htmlFor="property-type">Type</Label>
            <Select
              value={safePropertyType}
              onValueChange={(value) => {
                handleInputChange("propertyType", value);
                handleInputBlur("propertyType", value);
              }}
              defaultValue="not_specified"
            >
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem 
                    key={type.toLowerCase()} 
                    value={type.toLowerCase()}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price || ""}
              onChange={(e) => handleInputChange("price", e.target.value)}
              onBlur={(e) => handleInputBlur("price", e.target.value)}
              placeholder="e.g. $500,000"
            />
          </div>
          
          <div>
            <Label htmlFor="beds">Beds</Label>
            <Input
              id="beds"
              type="number"
              min="0"
              value={formData.bedrooms || ""}
              onChange={(e) => handleInputChange("bedrooms", e.target.value)}
              onBlur={(e) => handleInputBlur("bedrooms", e.target.value)}
              placeholder="e.g. 3"
            />
          </div>
          
          <div>
            <Label htmlFor="baths">Baths</Label>
            <Input
              id="baths"
              type="number"
              min="0"
              step="0.5"
              value={formData.bathrooms || ""}
              onChange={(e) => handleInputChange("bathrooms", e.target.value)}
              onBlur={(e) => handleInputBlur("bathrooms", e.target.value)}
              placeholder="e.g. 2"
            />
          </div>
          
          <div>
            <Label htmlFor="garages">Garages</Label>
            <Input
              id="garages"
              type="number"
              min="0"
              value={formData.garages || ""}
              onChange={(e) => handleInputChange("garages", e.target.value)}
              onBlur={(e) => handleInputBlur("garages", e.target.value)}
              placeholder="e.g. 1"
            />
          </div>
          
          <div>
            <Label htmlFor="size">Living Area (m2)</Label>
            <Input
              id="size"
              value={formData.sqft || ""}
              onChange={(e) => handleInputChange("sqft", e.target.value)}
              onBlur={(e) => handleInputBlur("sqft", e.target.value)}
              placeholder="e.g. 1,500"
            />
          </div>
          
          <div>
            <Label htmlFor="lot-size">Lot Size</Label>
            <Input
              id="lot-size"
              value={formData.livingArea || ""}
              onChange={(e) => handleInputChange("livingArea", e.target.value)}
              onBlur={(e) => handleInputBlur("livingArea", e.target.value)}
              placeholder="e.g. 0.25 acres"
            />
          </div>
          
          <div>
            <Label htmlFor="year-built">Year Built</Label>
            <Input
              id="year-built"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.buildYear || ""}
              onChange={(e) => handleInputChange("buildYear", e.target.value)}
              onBlur={(e) => handleInputBlur("buildYear", e.target.value)}
              placeholder="e.g. 2005"
            />
          </div>
          
          <div>
            <Label htmlFor="energy-label">Energy Label</Label>
            <Select
              value={safeEnergyLabel}
              onValueChange={(value) => {
                handleInputChange("energyLabel", value);
                handleInputBlur("energyLabel", value);
              }}
              defaultValue="none"
            >
              <SelectTrigger id="energy-label">
                <SelectValue placeholder="Select energy label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {energyLabels.map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="hasGarden"
              checked={formData.hasGarden || false}
              onCheckedChange={(checked) => handleSwitchChange("hasGarden", checked)}
            />
            <Label htmlFor="hasGarden">Has Garden</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
