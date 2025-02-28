
import { useCallback } from "react";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { v4 as uuidv4 } from "uuid";

export function usePropertyTechnicalData(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const addTechnicalItem = useCallback(() => {
    const newItem: PropertyTechnicalItem = {
      id: uuidv4(),
      title: "",
      size: "",
      description: "",
      floorplanId: null
    };

    setFormData({
      ...formData,
      technicalItems: [...(formData.technicalItems || []), newItem]
    });
  }, [formData, setFormData]);

  const removeTechnicalItem = useCallback((id: string) => {
    setFormData({
      ...formData,
      technicalItems: (formData.technicalItems || []).filter(item => item.id !== id)
    });
  }, [formData, setFormData]);

  const updateTechnicalItem = useCallback((id: string, field: keyof PropertyTechnicalItem, value: any) => {
    setFormData({
      ...formData,
      technicalItems: (formData.technicalItems || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  }, [formData, setFormData]);

  return {
    technicalItems: formData.technicalItems || [],
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem
  };
}
