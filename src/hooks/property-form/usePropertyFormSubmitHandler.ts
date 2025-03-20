
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyValidation } from "./usePropertyValidation";
import { useNavigate } from "react-router-dom";
import { usePropertyDataPreparer } from "./usePropertyDataPreparer";
import { usePropertyDatabase } from "./usePropertyDatabase";
import { usePropertyChangesLogger } from "./usePropertyChangesLogger";
import { usePropertyAfterSaveActions } from "./usePropertyAfterSaveActions";

export function usePropertyFormSubmitHandler() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validatePropertyData } = usePropertyValidation();
  const { prepareSubmitData } = usePropertyDataPreparer();
  const { updateProperty, createProperty } = usePropertyDatabase();
  const { fetchCurrentPropertyData, logChanges } = usePropertyChangesLogger();
  const { handleExistingPropertySave, handleNewPropertySave } = usePropertyAfterSaveActions();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData, shouldRedirect = false) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    
    // For new properties, validate the data
    if (!formData.id) {
      if (!validatePropertyData(formData)) {
        return false;
      }
    }
    
    try {
      // Prepare data for submission
      const submitData = prepareSubmitData(formData);
      console.log("usePropertyFormSubmit - Final submit data:", submitData);
      
      let success = false;
      let updatedPropertyData = null;
      
      if (formData.id) {
        // Get the current property data before updating to compare changes
        const currentPropertyData = await fetchCurrentPropertyData(formData.id);
          
        // Update existing property
        success = await updateProperty(formData.id, submitData);
        
        if (success) {
          // Perform after-save actions
          updatedPropertyData = await handleExistingPropertySave(formData);
          
          // Log the changes if update was successful
          await logChanges(formData.id, currentPropertyData, submitData);
        }
      } else {
        // Create new property
        success = await createProperty(submitData);
        
        if (success) {
          updatedPropertyData = await handleNewPropertySave(formData);
        }
        
        if (success && shouldRedirect) {
          navigate('/');
        }
      }
      
      console.log("usePropertyFormSubmit - Submission result:", success ? "Success" : "Failed");
      if (updatedPropertyData) {
        console.log("usePropertyFormSubmit - Updated timestamp:", updatedPropertyData.updated_at);
      }
      
      // Show a toast notification to confirm the save was successful
      if (success) {
        toast({
          title: "Success",
          description: formData.id ? "Property updated successfully" : "Property created successfully",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error during property submit:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your request",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSubmit };
}
