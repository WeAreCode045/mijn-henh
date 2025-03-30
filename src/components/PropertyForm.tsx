
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyTabsWrapper } from "./property/PropertyTabsWrapper";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData, PropertyFormData } from "@/types/property";
import { usePropertyDeletion } from "@/hooks/usePropertyDeletion";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";
import { usePropertyFormSteps } from "@/hooks/property-form/usePropertyFormSteps";

interface PropertyFormProps {
  initialTab?: string;
  initialContentStep?: number;
  formData?: PropertyFormData;
}

export function PropertyForm({ initialTab, initialContentStep, formData: propFormData }: PropertyFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formData: hookFormData, setFormData, isLoading } = usePropertyForm(id);
  const { settings } = useAgencySettings();
  const { toast } = useToast();
  const [agentInfo, setAgentInfo] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProperty } = usePropertyDeletion();
  
  // Use formData from props if available, otherwise use from hook
  const formData = propFormData || hookFormData;
  
  // Use the step navigation hook
  const { currentStep, handleStepClick, handleNext, handlePrevious } = usePropertyFormSteps();
  
  console.log("PropertyForm - Initial tab:", initialTab);
  console.log("PropertyForm - Initial content step:", initialContentStep);
  console.log("PropertyForm - Has form data from props:", !!propFormData);
  console.log("PropertyForm - Has form data from hook:", !!hookFormData);
  console.log("PropertyForm - Final form data available:", !!formData);

  useEffect(() => {
    if (formData?.title) {
      document.title = formData.title;
    } else {
      document.title = "Property";
    }
    
    return () => {
      document.title = "Brochure Generator";
    };
  }, [formData?.title]);

  useEffect(() => {
    if (formData?.agent_id) {
      const fetchAgentInfo = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', formData.agent_id)
            .single();
          
          if (data) {
            setAgentInfo({ id: data.id, name: data.full_name });
          }
        } catch (error) {
          console.error("Error fetching agent info:", error);
        }
      };

      fetchAgentInfo();
    }
  }, [formData?.agent_id]);

  const handleSave = () => {
    if (id) {
      toast({
        description: "Property data refreshed",
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.resolve();
    }
    
    try {
      setIsDeleting(true);
      
      const success = await deleteProperty(id);
      
      if (!success) {
        throw new Error("Property deletion failed");
      }
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Prevent form submissions from reloading the page
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Main property form submission prevented");
  };

  if (isLoading && !formData) {
    return <div className="p-4 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!formData) {
    console.error("PropertyForm - No form data available");
    return <div className="p-4 bg-red-50 text-red-800 rounded-md">
      Error: No property data available. Please try refreshing the page.
    </div>;
  }

  const propertyData: PropertyData = {
    ...formData,
    id: formData.id || '',
  };

  return (
    <div className="space-y-4">
      {formData.archived && (
        <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
          <Clock className="h-4 w-4" />
          <AlertTitle>This property is archived</AlertTitle>
          <AlertDescription>
            Editing is disabled. You can still view the property but must unarchive it to make changes.
          </AlertDescription>
        </Alert>
      )}
      
      <form id="propertyForm" onSubmit={handleFormSubmit}>
        <PropertyTabsWrapper
          property={propertyData}
          settings={settings}
          onSave={handleSave}
          onDelete={handleDelete}
          agentInfo={agentInfo}
          isArchived={!!formData.archived}
          initialTab={initialTab}
          initialContentStep={initialContentStep}
          formData={formData}
          // Pass necessary handlers that need to be available to inner content tabs
          handlers={{
            onFieldChange: (field, value) => {
              if (setFormData) {
                setFormData(prev => ({
                  ...prev,
                  [field]: value
                }));
              }
            },
            currentStep: currentStep,
            handleStepClick: handleStepClick,
            handleNext: handleNext,
            handlePrevious: handlePrevious
          }}
        />
      </form>
    </div>
  );
}
