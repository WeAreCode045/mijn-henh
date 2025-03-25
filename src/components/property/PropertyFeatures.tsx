
import React, { useState, useEffect, useRef } from "react";
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
  // Add debounced updates
  const [localFeatures, setLocalFeatures] = useState<PropertyFeature[]>(features);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Sync local state with props
  useEffect(() => {
    setLocalFeatures(features);
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
    setLocalFeatures(prev => 
      prev.map(feature => 
        feature.id === id ? { ...feature, description: value } : feature
      )
    );
    
    // Clear any existing timer for this feature
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    
    // Set a new debounce timer
    debounceTimers.current[id] = setTimeout(() => {
      console.log("Updating feature after debounce:", id, value);
      onUpdate(id, value);
    }, 500); // 500ms debounce delay
  };

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Features</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>
      {localFeatures.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No features added yet. Click the button above to add features.
        </p>
      ) : (
        localFeatures.map((feature) => (
          <div key={feature.id} className="flex items-center gap-2">
            <Input
              value={feature.description}
              onChange={(e) => handleLocalUpdate(feature.id, e.target.value)}
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
