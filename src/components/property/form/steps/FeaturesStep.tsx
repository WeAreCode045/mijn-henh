
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import type { PropertyFeature } from "@/types/property";
import { Spinner } from "@/components/ui/spinner";

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
  
  // If features is undefined, provide a loading state
  if (features === undefined) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner className="h-8 w-8 border-4" />
      </div>
    );
  }
  
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
