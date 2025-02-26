
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
  features,
  onAdd,
  onRemove,
  onUpdate,
}: PropertyFeaturesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Kenmerken</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Kenmerk Toevoegen
        </Button>
      </div>
      {features.map((feature) => (
        <div key={feature.id} className="flex items-center gap-2">
          <Input
            value={feature.description}
            onChange={(e) => onUpdate(feature.id, e.target.value)}
            placeholder="Voer kenmerk in"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(feature.id)}
          >
            <MinusCircle className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
