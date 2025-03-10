
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyFormData, PropertyFeature } from "@/types/property";

interface FeaturesStepProps {
  formData: PropertyFormData;
  features?: PropertyFeature[]; // Made this optional
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function FeaturesStep({
  formData,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  setPendingChanges
}: FeaturesStepProps) {
  console.log("FeaturesStep rendering with features:", formData.features);
  
  const handleFeatureChange = (id: string, description: string) => {
    onUpdateFeature(id, description);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Property Features</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add all the distinctive features that make this property stand out.
      </p>
      
      <PropertyFeatures
        features={formData.features || []} // Ensure we always pass an array
        onAdd={() => {
          onAddFeature();
          if (setPendingChanges) {
            setPendingChanges(true);
          }
        }}
        onRemove={(id) => {
          onRemoveFeature(id);
          if (setPendingChanges) {
            setPendingChanges(true);
          }
        }}
        onUpdate={handleFeatureChange}
      />
    </div>
  );
}
