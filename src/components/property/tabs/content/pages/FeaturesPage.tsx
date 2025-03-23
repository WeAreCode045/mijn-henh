
import React, { useState } from "react";
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { EditButton } from "@/components/property/content/EditButton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { Json } from "@/integrations/supabase/types";

interface FeaturesPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function FeaturesPage({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  setPendingChanges
}: FeaturesPageProps) {
  const { toast } = useToast();
  const [isEditingFeatures, setIsEditingFeatures] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editableFeatures, setEditableFeatures] = useState<PropertyFeature[]>([...(formData.features || [])]);

  const addFeature = () => {
    setEditableFeatures([
      ...editableFeatures,
      { id: uuidv4(), description: '' }
    ]);
  };

  const removeFeature = (id: string) => {
    setEditableFeatures(editableFeatures.filter(feature => feature.id !== id));
  };

  const updateFeature = (id: string, description: string) => {
    setEditableFeatures(
      editableFeatures.map(feature => 
        feature.id === id ? { ...feature, description } : feature
      )
    );
  };

  const saveFeatures = async () => {
    if (!formData.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          features: editableFeatures as unknown as Json
        })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Update parent state
      onFieldChange('features', editableFeatures);
      if (setPendingChanges) setPendingChanges(false);
      
      toast({
        title: "Updated",
        description: "Property features updated successfully",
      });
      
      setIsEditingFeatures(false);
    } catch (error) {
      console.error("Error updating features:", error);
      toast({
        title: "Error",
        description: "Could not update property features",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Property Features</CardTitle>
          <EditButton
            isEditing={isEditingFeatures}
            onToggle={() => setIsEditingFeatures(!isEditingFeatures)}
            onSave={saveFeatures}
            isSaving={isSaving}
          />
        </CardHeader>
        <CardContent>
          {isEditingFeatures ? (
            <div className="space-y-4">
              {editableFeatures.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No features added yet.</p>
              ) : (
                editableFeatures.map((feature, index) => (
                  <div key={feature.id} className="flex items-start gap-2">
                    <Textarea 
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFeature(feature.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          ) : (
            <div>
              {editableFeatures.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No features added yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {editableFeatures.map((feature) => (
                    <li key={feature.id}>{feature.description}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
