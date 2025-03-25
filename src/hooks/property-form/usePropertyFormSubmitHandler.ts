
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
  const { updateProperty } = usePropertyDatabase();
  const { fetchCurrentPropertyData, logChanges } = usePropertyChangesLogger();
  const { handleExistingPropertySave } = usePropertyAfterSaveActions();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData, shouldRedirect = false) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    
    // For all properties, validate the data
    if (!validatePropertyData(formData)) {
      return false;
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
          
        // Update property
        success = await updateProperty(formData.id, submitData);
        
        if (success) {
          // Perform after-save actions
          updatedPropertyData = await handleExistingPropertySave(formData);
          
          // Log the changes if update was successful
          await logChanges(formData.id, currentPropertyData, submitData);
        }
        
        // Remove redirect logic. Only redirect if explicitly asked to and successful
        if (success && shouldRedirect) {
          // Instead of always redirecting to index, we'll use the current URL
          // This will effectively just reload the current page
          const currentUrl = window.location.pathname;
          navigate(currentUrl);
        }
      } else {
        // This should not happen anymore since we create properties upfront
        toast({
          title: "Error",
          description: "Property ID is missing. This should not happen.",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("usePropertyFormSubmit - Submission result:", success ? "Success" : "Failed");
      if (updatedPropertyData) {
        console.log("usePropertyFormSubmit - Updated timestamp:", updatedPropertyData.updated_at);
      }
      
      // Show a toast notification to confirm the save was successful
      if (success) {
        toast({
          title: "Success",
          description: "Property updated successfully",
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
