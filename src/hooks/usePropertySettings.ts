import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function usePropertySettings() {
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const updatePropertySetting = async (
    propertyId: string,
    fieldName: string,
    value: any
  ) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ [fieldName]: value })
        .eq('id', propertyId);

      if (error) {
        console.error(`Error updating ${fieldName}:`, error);
        toast({
          title: "Error",
          description: `Failed to update ${fieldName}`,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: `${fieldName} updated successfully`,
      });

      await logPropertyChange(propertyId, "settings", `Updated ${fieldName} to ${value}`);

      return true;
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${fieldName}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return { updatePropertySetting };
}
