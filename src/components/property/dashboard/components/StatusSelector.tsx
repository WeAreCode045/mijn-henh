
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface StatusSelectorProps {
  propertyId: string;
  initialStatus?: string;
}

export function StatusSelector({ propertyId, initialStatus = "Draft" }: StatusSelectorProps) {
  const [propertyStatus, setPropertyStatus] = useState(initialStatus);
  const { toast } = useToast();

  useEffect(() => {
    if (initialStatus) {
      setPropertyStatus(initialStatus);
    }
  }, [initialStatus]);

  const handleStatusChange = async (status: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', propertyId);
      
      if (error) throw error;
      
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
