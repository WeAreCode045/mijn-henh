
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFeature } from "@/types/property";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface FeatureSelectorProps {
  availableFeatures: PropertyFeature[];
  selectedFeatures: PropertyFeature[];
  onAddFeature: (feature: PropertyFeature) => void;
  onRemoveFeature: (id: string) => void;
  onAddMultipleFeatures: (features: PropertyFeature[]) => void;
}

export function FeatureSelector({
  availableFeatures,
  selectedFeatures,
  onAddFeature,
  onRemoveFeature,
  onAddMultipleFeatures
}: FeatureSelectorProps) {
  const [newFeaturesText, setNewFeaturesText] = useState<string>("");

  // Check if a feature is selected
  const isFeatureSelected = (id: string) => {
    return selectedFeatures.some(feature => feature.id === id);
  };

  // Toggle a feature selection
  const handleFeatureToggle = (id: string, checked: boolean) => {
    const feature = availableFeatures.find(f => f.id === id);
    if (!feature) return;

    if (checked) {
      onAddFeature(feature);
    } else {
      onRemoveFeature(id);
    }
  };

  // Handle adding multiple features from textarea
  const handleAddMultipleFeatures = () => {
    if (!newFeaturesText.trim()) return;
    
    const featureLines = newFeaturesText.split('\n').filter(line => line.trim() !== '');
    const newFeatures = featureLines.map(description => ({
      id: uuidv4(),
      description
    }));
    
    onAddMultipleFeatures(newFeatures);
    setNewFeaturesText(""); // Clear the textarea
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Property Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableFeatures.map(feature => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`feature-${feature.id}`}
                checked={isFeatureSelected(feature.id)}
                onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked === true)}
              />
              <label
                htmlFor={`feature-${feature.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature.description}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Features</h3>
        <p className="text-sm text-muted-foreground">
          Add multiple features at once, each on a new line.
        </p>
        <Textarea
          placeholder="Enter new features, one per line..."
          value={newFeaturesText}
          onChange={(e) => setNewFeaturesText(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          type="button" 
          onClick={handleAddMultipleFeatures}
          disabled={!newFeaturesText.trim()}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Features
        </Button>
      </div>
    </div>
  );
}
