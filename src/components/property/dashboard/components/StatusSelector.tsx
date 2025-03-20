
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

interface StatusSelectorProps {
  propertyId: string;
  initialStatus?: string;
}

export function StatusSelector({ propertyId, initialStatus = "Draft" }: StatusSelectorProps) {
  const [propertyStatus, setPropertyStatus] = useState(initialStatus);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  useEffect(() => {
    if (initialStatus) {
      setPropertyStatus(initialStatus);
    }
  }, [initialStatus]);

  const handleStatusChange = async (status: string) => {
    try {
      // Get the current property data first
      const { data: propertyData, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Type assertion to access metadata property
      type RawPropertyData = {
        metadata?: Record<string, any>;
        status?: string;
        [key: string]: any;
      };
      
      // Prepare the metadata object, preserving any existing metadata
      const typedPropertyData = propertyData as RawPropertyData;
      const currentMetadata = typedPropertyData.metadata || {};
      const currentStatus = typedPropertyData.status || 'Draft';
      const updatedMetadata = {
        ...currentMetadata,
        status
      };
      
      // Update the property with the new metadata
      const { error } = await supabase
        .from('properties')
        .update({ 
          metadata: updatedMetadata,
          status: status // Also update the direct status field for backward compatibility
        })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      // Log the status change
      await logPropertyChange(propertyId, 'status', currentStatus, status);
      
      setPropertyStatus(status);
      toast({
        title: "Status updated",
        description: `Property status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update the property status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="property-status">Property Status</Label>
      <Select 
        value={propertyStatus} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger id="property-status" className="w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Available">Available</SelectItem>
          <SelectItem value="Under Option">Under Option</SelectItem>
          <SelectItem value="Sold">Sold</SelectItem>
          <SelectItem value="Withdrawn">Withdrawn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
