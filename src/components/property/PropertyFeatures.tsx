
import React from "react";
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
  features = [],
  onAdd,
  onRemove,
  onUpdate,
}: PropertyFeaturesProps) {
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

  const handleUpdate = (id: string, value: string) => {
    console.log("Updating feature:", id, value);
    onUpdate(id, value);
  };

  return (
    <div className="p-6 bg-white rounded-lg border space-y-4">
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
              value={feature.description}
              onChange={(e) => handleUpdate(feature.id, e.target.value)}
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
