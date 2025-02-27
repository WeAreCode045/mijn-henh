
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
      <PropertyFeatures
        features={features || []} // Ensure we always pass an array
        onAdd={onAddFeature}
        onRemove={onRemoveFeature}
        onUpdate={onUpdateFeature}
      />
    </div>
  );
}
