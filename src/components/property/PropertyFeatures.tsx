
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyFeature } from "@/types/property";
import { PlusCircle, MinusCircle } from "lucide-react";

interface PropertyFeaturesProps {
  features: PropertyFeature[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, description: string) => void;
}

export function PropertyFeatures({
  features = [], // Add default empty array
  onAdd,
  onRemove,
  onUpdate,
}: PropertyFeaturesProps) {
  // Local state for form values with proper typing
  const [localFeatures, setLocalFeatures] = useState<{[key: string]: string}>(
    features.reduce((acc, feature) => ({
      ...acc,
      [feature.id]: feature.description
    }), {})
  );
  
  // Sync local state with props, but only for new features
  useEffect(() => {
    const newLocalFeatures = {...localFeatures};
    let hasChanges = false;
    
    // Add any new features from props
    features.forEach(feature => {
      if (localFeatures[feature.id] === undefined) {
        newLocalFeatures[feature.id] = feature.description;
        hasChanges = true;
      }
    });
    
    // Remove any features that are no longer in props
    Object.keys(localFeatures).forEach(id => {
      if (!features.some(feature => feature.id === id)) {
        delete newLocalFeatures[id];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setLocalFeatures(newLocalFeatures);
    }
  }, [features]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Adding new feature");
    onAdd();
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    console.log("Removing feature with ID:", id);
    onRemove(id);
  };

  const handleLocalUpdate = (id: string, value: string) => {
    // Update local state immediately for UI responsiveness
    setLocalFeatures(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle blur event to save changes only when the field loses focus
  const handleBlur = (id: string, value: string) => {
    // Only call the update function if the value has actually changed
    const originalFeature = features.find(feature => feature.id === id);
    if (originalFeature && originalFeature.description !== value) {
      console.log("Saving feature on blur:", id, value);
      onUpdate(id, value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Features</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>
      {features.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No features added yet. Click the button above to add features.
        </p>
      ) : (
        features.map((feature) => (
          <div key={feature.id} className="flex items-center gap-2">
            <Input
              value={localFeatures[feature.id] || ''}
              onChange={(e) => handleLocalUpdate(feature.id, e.target.value)}
              onBlur={(e) => handleBlur(feature.id, e.target.value)}
              placeholder="Enter feature"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => handleRemove(e, feature.id)}
            >
              <MinusCircle className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
