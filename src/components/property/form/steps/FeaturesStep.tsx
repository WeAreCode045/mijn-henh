
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import type { PropertyFeature } from "@/types/property";

interface FeaturesStepProps {
  features: PropertyFeature[];
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
}

export function FeaturesStep({
  features = [], // Add default empty array to prevent null/undefined issues
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
}: FeaturesStepProps) {
  console.log("FeaturesStep rendering with features:", features);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Property Features</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add all the distinctive features that make this property stand out.
      </p>
      
      <PropertyFeatures
        features={features || []} // Ensure we always pass an array
        onAdd={onAddFeature}
        onRemove={onRemoveFeature}
        onUpdate={onUpdateFeature}
      />
    </div>
  );
}
