
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export const usePropertyFormContainerActions = (
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setSelectedAgent: (agentId: string | null) => void,
  setAgentInfo: (info: { id: string; name: string } | null) => void,
  toast: any,
  agents: any[]
) => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);

  const deleteProperty = async () => {
    if (!formData.id) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;
    
    setIsSubmitting(true);
    
    try {
      // Delete property images first
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', formData.id);
      
      // Then delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', formData.id);
      
      if (error) throw error;
      
      toast({
        description: "Property deleted successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const saveProperty = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      let propertyId = formData.id;
      
      // Prepare data for submission
      const propertyData = {
        title: formData.title || "Untitled Property",
        price: formData.price,
        address: formData.address,
        description: formData.description,
        agent_id: formData.agent_id,
      };
      
      if (propertyId) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);
        
        if (error) throw error;
      } else {
        // Create new property
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select();
        
        if (error) throw error;
        
        propertyId = data?.[0]?.id;
        if (!propertyId) throw new Error("Failed to get ID of new property");
        
        // Update formData with the new ID
        setFormData({
          ...formData,
          id: propertyId
        });
        
        // Navigate to the edit page for the new property
        navigate(`/properties/${propertyId}/edit`);
      }
      
      toast({
        description: propertyId ? "Property updated successfully" : "Property created successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate, setFormData, setIsSubmitting, toast]);
  
  const handleAgentChange = async (agentId: string) => {
    try {
      setFormData({
        ...formData,
        agent_id: agentId === "" ? null : agentId
      });
      
      setSelectedAgent(agentId === "" ? null : agentId);
      
      // Update agent info if agent was selected
      if (agentId) {
        const agent = agents.find(a => a.id === agentId);
        
        if (agent) {
          setAgentInfo({
            id: agent.id,
            name: agent.full_name
          });
        }
      } else {
        setAgentInfo(null);
      }
      
      // If this is an existing property, update the agent_id in the database
      if (formData.id) {
        const { error } = await supabase
          .from('properties')
          .update({ agent_id: agentId === "" ? null : agentId })
          .eq('id', formData.id);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is just a stub since we're not implementing all the functionality
    console.log("Image upload:", e);
  };
  
  const handleRemoveImage = (index: number) => {
    // This is just a stub since we're not implementing all the functionality
    console.log("Remove image at index:", index);
  };
  
  return {
    deleteProperty,
    saveProperty,
    handleAgentChange,
    handleImageUpload,
    handleRemoveImage,
    images
  };
};
