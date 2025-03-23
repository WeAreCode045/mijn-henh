
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";
import { ContentSaveButton } from "@/components/property/form/steps/common/ContentSaveButton";

interface FeaturesPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  setPendingChanges?: (pending: boolean) => void;
  onSubmit?: () => void;
  isSaving?: boolean;
}

export function FeaturesPage({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  setPendingChanges,
  onSubmit,
  isSaving = false
}: FeaturesPageProps) {
  
  const handleChange = () => {
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleFeatureAdd = () => {
    onAddFeature();
    handleChange();
  };
  
  const handleFeatureRemove = (id: string) => {
    onRemoveFeature(id);
    handleChange();
  };
  
  const handleFeatureUpdate = (id: string, description: string) => {
    onUpdateFeature(id, description);
    handleChange();
  };

  const handleSave = () => {
    if (onSubmit) {
      onSubmit();
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Property Features</CardTitle>
          <Button variant="outline" size="sm" onClick={handleFeatureAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </CardHeader>
        <CardContent>
          {formData.features && formData.features.length > 0 ? (
            <div className="space-y-3">
              {formData.features.map((feature) => (
                <div key={feature.id} className="flex gap-2">
                  <Input
                    value={feature.description || ''}
                    onChange={(e) => handleFeatureUpdate(feature.id, e.target.value)}
                    placeholder="Enter feature"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleFeatureRemove(feature.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No features added yet. Click the "Add Feature" button to add property features.</p>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <ContentSaveButton onSave={handleSave} isSaving={isSaving} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
