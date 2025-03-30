
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionSection } from "@/components/property/form/steps/general-info/DescriptionSection";
import { PropertySpecs } from "@/components/property/form/steps/general-info/PropertySpecs";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
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
  // Create local state to track changes without saving immediately
  const [localFormData, setLocalFormData] = useState<PropertyFormData>(formData);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Update local state when parent formData changes (e.g. initial load)
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // Log to help with debugging
  console.log("GeneralPage - Form data:", {
    title: localFormData?.title,
    description: localFormData?.description ? localFormData.description.substring(0, 20) + '...' : 'N/A',
    hasData: !!localFormData
  });

  if (!localFormData) {
    return <div>Loading property data...</div>;
  }

  // Handle local field changes without saving to DB
  const handleLocalFieldChange = (field: keyof PropertyFormData, value: any) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Notify parent component that there are pending changes
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  // Save all changes to the database when save button is clicked
  const handleSaveChanges = async () => {
    if (!localFormData.id) return;

    setIsSaving(true);
    try {
      // Extract fields that are different from the original formData
      const changedFields: Partial<PropertyFormData> = {};
      Object.keys(localFormData).forEach((key) => {
        const typedKey = key as keyof PropertyFormData;
        if (JSON.stringify(localFormData[typedKey]) !== JSON.stringify(formData[typedKey])) {
          changedFields[typedKey] = localFormData[typedKey];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast({
          description: "No changes to save",
        });
        setIsSaving(false);
        return;
      }

      // Save changes to database
      const { error } = await supabase
        .from('properties')
        .update(changedFields)
        .eq('id', localFormData.id);

      if (error) throw error;

      // Update parent state
      Object.keys(changedFields).forEach((key) => {
        onFieldChange(key as keyof PropertyFormData, changedFields[key as keyof PropertyFormData]);
      });

      // Notify success
      toast({
        title: "Saved",
        description: "All changes have been saved successfully",
      });

      // Reset pending changes flag
      if (setPendingChanges) {
        setPendingChanges(false);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Description (2/3 width) */}
        <div className="lg:col-span-2">
          <DescriptionSection 
            formData={localFormData}
            onFieldChange={handleLocalFieldChange} 
            setPendingChanges={undefined} // Disable auto-save
          />
        </div>
        
        {/* Key Information (1/3 width) */}
        <div className="lg:col-span-1">
          <PropertySpecs 
            formData={localFormData} 
            onFieldChange={handleLocalFieldChange}
            setPendingChanges={undefined} // Disable auto-save
          />
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSaveChanges} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
