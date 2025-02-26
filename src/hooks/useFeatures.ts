
import type { PropertyFeature, PropertyFormData } from "@/types/property";

export function useFeatures(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { id: Date.now().toString(), description: "" }],
    });
  };

  const removeFeature = (id: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((feature) => feature.id !== id),
    });
  };

  const updateFeature = (id: string, description: string) => {
    setFormData({
      ...formData,
      features: formData.features.map((feature) =>
        feature.id === id ? { ...feature, description } : feature
      ),
    });
  };

  return {
    addFeature,
    removeFeature,
    updateFeature,
  };
}
