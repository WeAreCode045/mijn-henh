
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PropertyTabsWrapper } from "./property/PropertyTabsWrapper";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from "@/types/property";
import { usePropertyDeletion } from "@/hooks/usePropertyDeletion";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";

export function PropertyForm() {
  const { id } = useParams();
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { settings } = useAgencySettings();
  const { toast } = useToast();
  const [agentInfo, setAgentInfo] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProperty } = usePropertyDeletion();

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

  if (isLoading || !formData) {
    return <div className="p-4 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
        />
      </form>
    </div>
  );
}
