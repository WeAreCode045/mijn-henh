
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFloorplans } from "@/hooks/usePropertyFloorplans";
import { usePropertyAreaPhotos } from "@/hooks/images/usePropertyAreaPhotos";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyStepNavigation } from "@/hooks/usePropertyStepNavigation";
import { usePropertyStateTracking } from "@/hooks/usePropertyStateTracking";
import { safeToString } from "@/utils/stringUtils";
import { usePropertyFeatures } from "@/hooks/property/usePropertyFeatures";

export function AddPropertyForm({ property, onSave, onDelete }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedAgent, setSelectedAgent] = useState(property?.agent_id || null);
  const [selectedTemplate, setSelectedTemplate] = useState(property?.template_id || "default");
  const [agents, setAgents] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  const [formState, setFormState] = useState(property || {});
  
  const handleFieldChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const contentManager = usePropertyContent(
    formState,
    handleFieldChange
  );
  
  const { addFeature, removeFeature, updateFeature } = usePropertyFeatures(
    formState,
    setFormState
  );
  
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
  } = usePropertyAreas(
    formState, 
    setFormState
  );
  
  const {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    images
  } = usePropertyImages(formState, handleFieldChange);

  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  } = usePropertyFloorplans(formState, handleFieldChange);
  
  const { currentStep, handleStepClick, handleNext, handlePrevious } = 
    usePropertyStepNavigation();

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'agent');
        
      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }
      
      setAgents(data || []);
    };
    
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('id, name');
        
      if (error) {
        console.error('Error fetching templates:', error);
        return;
      }
      
      const templatesWithDefault = [
        { id: 'default', name: 'Default Template' },
        ...(data || [])
      ];
      
      setTemplates(templatesWithDefault);
    };
    
    fetchAgents();
    fetchTemplates();
  }, []);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{property?.id ? 'Edit Property' : 'Add New Property'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Agent and template selectors would go here */}
              </div>
              
              {property?.id && (
                <div className="text-sm text-gray-500">
                  ID: {safeToString(property.id)}
                </div>
              )}
            </div>
            
            {/* Form steps and content would go here */}
            
            {property?.id && (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isSubmitting}
                >
                  Delete Property
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
