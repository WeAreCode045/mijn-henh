
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useParams } from "react-router-dom";
import { PropertyFormData } from "@/types/property";
import { useState, useEffect } from "react";

export function usePropertyFormContainerData() {
  const { id } = useParams();
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update document title based on property title
  useEffect(() => {
    if (formData?.title) {
      document.title = formData.title;
    } else {
      document.title = id ? "Edit Property" : "New Property";
    }
    
    return () => {
      document.title = "Property Manager";
    };
  }, [formData?.title, id]);
  
  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    setIsSaving
  };
}
