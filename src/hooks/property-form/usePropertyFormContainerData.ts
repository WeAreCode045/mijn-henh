
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useParams } from "react-router-dom";
import { PropertyFormData } from "@/types/property";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function usePropertyFormContainerData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const [isSaving, setIsSaving] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
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

  // Placeholder for navigation functions that would be implemented in a real app
  const handleGoBack = () => {
    navigate('/properties');
  };

  const handleViewProperty = () => {
    if (id) {
      navigate(`/property/${id}/webview`);
    }
  };
  
  return {
    id,
    formData,
    setFormData,
    isLoading,
    isSaving,
    setIsSaving,
    agents,
    saving,
    setSaving,
    handleGoBack,
    handleViewProperty
  };
}
