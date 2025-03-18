
import { PropertyFormData } from "@/types/property";

/**
 * Hook with methods for handling property saving operations
 */
export function useSaveHandlers(
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  // Handler for saving object ID
  const handleSaveObjectId = (objectId: string) => {
    onFieldChange('object_id', objectId);
  };
  
  // Handler for saving agent ID
  const handleSaveAgent = (agentId: string) => {
    onFieldChange('agent_id', agentId);
  };
  
  // Handler for saving template ID
  const handleSaveTemplate = (templateId: string) => {
    onFieldChange('template_id', templateId);
  };

  return {
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate
  };
}
