
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFeature } from "@/types/property";
import { PropertyArea } from "@/types/property";
import { PropertyNearbyPlace } from "@/types/property";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFloorplans } from "@/hooks/images/usePropertyFloorplans";
import { usePropertyAreaPhotos } from "@/hooks/images/usePropertyAreaPhotos";
import { usePropertyMainImages } from "@/hooks/images/usePropertyMainImages";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyStepNavigation } from "@/hooks/usePropertyStepNavigation";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { usePropertyStateTracking } from "@/hooks/usePropertyStateTracking";
import { usePropertyFormActions } from "@/hooks/usePropertyFormActions";
import { safeToString } from "@/utils/stringUtils";

// This component is currently unused and should be refactored or removed
// in the future. It contains imports to components that might not exist.
export function AddPropertyForm({ property, onSave, onDelete }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedAgent, setSelectedAgent] = useState(property?.agent_id || null);
  const [selectedTemplate, setSelectedTemplate] = useState(property?.template_id || "default");
  const [agents, setAgents] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // Form state management
  const [formState, setFormState] = useState(property || {});
  
  // Replace with direct field change handler
  const handleFieldChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-save functionality
  const { 
    autosaveData, 
    isSaving, 
    lastSaved, 
    pendingChanges, 
    setPendingChanges, 
    setLastSaved 
  } = usePropertyAutoSave();
  
  // Property content management
  const contentManager = usePropertyContent(
    formState,
    handleFieldChange
  );
  
  // Feature management
  const { addFeature, removeFeature, updateFeature } = useFeatures(
    formState,
    setFormState
  );
  
  // Property areas management
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
  
  // Property images management
  const {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    images
  } = usePropertyImages(
    formState, 
    setFormState
  );

  // Property floorplans management
  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  } = usePropertyFloorplans(
    formState,
    setFormState
  );
  
  // Step navigation with auto-save
  const { currentStep, handleStepClick, handleNext, handlePrevious } = 
    usePropertyStepNavigation();
  
  // Form submission and other actions
  const { handleSaveObjectId, handleSaveAgent, handleSaveTemplate, onSubmit } = 
    usePropertyFormActions();

  // Fetch agents and templates on component mount
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
      
      // Add default template
      const templatesWithDefault = [
        { id: 'default', name: 'Default Template' },
        ...(data || [])
      ];
      
      setTemplates(templatesWithDefault);
    };
    
    fetchAgents();
    fetchTemplates();
  }, []);
  
  // NOTE: This component has many missing imports and should be refactored or removed.
  // It's not currently being used in the application.
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
