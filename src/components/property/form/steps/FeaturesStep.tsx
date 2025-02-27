
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import type { PropertyFeature } from "@/types/property";

interface FeaturesStepProps {
  features: PropertyFeature[];
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
}

export function FeaturesStep({
  features,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
}: FeaturesStepProps) {
  return (
    <div className="space-y-6">
      <PropertyFeatures
        features={features}
        onAdd={onAddFeature}
        onRemove={onRemoveFeature}
        onUpdate={onUpdateFeature}
      />
    </div>
  );
}
