
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { useAgencySettings } from '@/hooks/useAgencySettings';
import { useAgentSelect } from '@/hooks/useAgentSelect';
import { useToast } from '@/components/ui/use-toast';
import { PropertyFormData } from '@/types/property';

export function usePropertyFormContainerData(propertyIdFromUrl?: string | null) {
  // Get property ID from URL parameters or use provided ID
  const { id: idFromParams } = useParams();
  const id = propertyIdFromUrl || idFromParams;
  
  // Log the property ID to debug
  useEffect(() => {
    console.log("usePropertyFormContainerData - Using property ID:", id);
  }, [id]);

  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { settings } = useAgencySettings();
  const { agents } = useAgentSelect();
  const { toast } = useToast();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Additional logging to help debug
  useEffect(() => {
    console.log("usePropertyFormContainerData - isLoading:", isLoading);
    console.log("usePropertyFormContainerData - Has formData:", !!formData);
    if (formData) {
      console.log("usePropertyFormContainerData - formData ID:", formData.id);
      console.log("usePropertyFormContainerData - formData title:", formData.title);
    }
  }, [formData, isLoading]);

  // Set selected agent when formData changes
  useEffect(() => {
    if (formData?.agent_id) {
      setSelectedAgent(formData.agent_id);
    }
  }, [formData?.agent_id]);

  return {
    id,
    formData,
    setFormData,
    isLoading,
    settings,
    agents,
    selectedAgent,
    setSelectedAgent,
    isSubmitting,
    setIsSubmitting,
    toast
  };
}
