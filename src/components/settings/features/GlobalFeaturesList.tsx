
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MinusCircle, Edit, Save } from "lucide-react";
import { PropertyFeature } from "@/types/property";

interface GlobalFeaturesListProps {
  features: PropertyFeature[];
  onFeatureAdd: (feature: string) => void;
  onFeatureRemove: (id: string) => void;
}

export function GlobalFeaturesList({
  features,
  onFeatureAdd,
  onFeatureRemove
}: GlobalFeaturesListProps) {
  const [newFeature, setNewFeature] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onFeatureAdd(newFeature.trim());
      setNewFeature("");
    }
  };

  const startEditing = (feature: PropertyFeature) => {
    setEditId(feature.id);
    setEditValue(feature.description);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      // Find the feature and update its description
      const updatedFeature = { 
        id, 
        description: editValue.trim() 
      };
      
      // Remove the old feature
      onFeatureRemove(id);
      
      // Add the updated feature
      onFeatureAdd(updatedFeature.description);
    }
    
    setEditId(null);
    setEditValue("");
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">Features List</div>
      
      {features.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No global features added yet. Add features below to make them available to all properties.
        </p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center gap-2">
              {editId === feature.id ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Feature description"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => saveEdit(feature.id)}
                  >
                    <Save className="w-4 h-4 text-primary" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{feature.description}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(feature)}
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onFeatureRemove(feature.id)}
                  >
                    <MinusCircle className="w-4 h-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a new feature"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddFeature}
          disabled={!newFeature.trim()}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>
    </div>
  );
}
