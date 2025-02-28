
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
  features = [], // Add default empty array
  onAdd,
  onRemove,
  onUpdate,
}: PropertyFeaturesProps) {
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onAdd();
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onRemove(id);
  };

  const handleUpdate = (id: string, value: string) => {
    console.log("Updating feature:", id, value);
    onUpdate(id, value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Kenmerken</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Kenmerk Toevoegen
        </Button>
      </div>
      {features.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Nog geen kenmerken toegevoegd. Klik op de knop hierboven om te beginnen.
        </p>
      ) : (
        features.map((feature) => (
          <div key={feature.id} className="flex items-center gap-2">
            <Input
              value={feature.description}
              onChange={(e) => handleUpdate(feature.id, e.target.value)}
              placeholder="Voer kenmerk in"
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
