
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

interface StatusSelectorProps {
  propertyId: string;
  initialStatus?: string;
  onStatusChange: (status: string) => Promise<void>;
}

export function StatusSelector({ propertyId, initialStatus, onStatusChange }: StatusSelectorProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus || "draft");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  useEffect(() => {
    if (initialStatus !== undefined) {
      setCurrentStatus(initialStatus || "draft");
    }
  }, [initialStatus]);

  const handleStatusChange = async (status: string) => {
    if (!status || status === "") {
      status = "draft"; // Prevent empty status
    }
    
    try {
      setIsUpdating(true);
      await onStatusChange(status);
      
      setCurrentStatus(status);
      
      toast({
        title: "Status updated",
        description: `Property status has been set to ${status}`,
      });
      
      // Log the property edit
      await logPropertyChange(propertyId, "status", `Updated status to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="status-select">Property Status</Label>
      <Select 
        value={currentStatus} 
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger id="status-select" className="w-full">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
          <SelectItem value="rented">Rented</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
