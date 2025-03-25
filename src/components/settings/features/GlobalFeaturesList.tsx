
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Edit, Save, Trash } from "lucide-react";
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
  const [editingFeature, setEditingFeature] = useState<PropertyFeature | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onFeatureAdd(newFeature.trim());
      setNewFeature("");
    }
  };

  const startEditing = (feature: PropertyFeature) => {
    setEditingFeature(feature);
    setEditValue(feature.description);
  };

  const cancelEditing = () => {
    setEditingFeature(null);
    setEditValue("");
  };

  const saveEditing = () => {
    if (editingFeature && editValue.trim()) {
      // For now, remove the old feature and add the new one
      // In a real app, you'd want to have an update function
      onFeatureRemove(editingFeature.id);
      onFeatureAdd(editValue.trim());
      setEditingFeature(null);
      setEditValue("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Global Features</h3>
        <div className="text-xs text-muted-foreground mb-4">
          These features will be available to select for all properties.
        </div>
      </div>

      {/* Feature list */}
      <div className="space-y-2">
        {features.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">No global features added yet.</div>
        ) : (
          features.map((feature) => (
            <div 
              key={feature.id} 
              className="flex items-center justify-between p-2 border rounded-md"
            >
              {editingFeature?.id === feature.id ? (
                <div className="flex-1 flex gap-2">
                  <Input 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={saveEditing}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={cancelEditing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-sm">{feature.description}</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => startEditing(feature)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onFeatureRemove(feature.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add new feature */}
      <div className="flex gap-2">
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add new feature"
          className="flex-1"
        />
        <Button
          onClick={handleAddFeature}
          disabled={!newFeature.trim()}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
}
