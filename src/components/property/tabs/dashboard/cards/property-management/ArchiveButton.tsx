
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ArchiveButtonProps {
  propertyId: string;
  isArchived?: boolean;
}

export function ArchiveButton({ propertyId, isArchived = false }: ArchiveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleArchiveToggle = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ archived: !isArchived })
        .eq('id', propertyId);
        
      if (error) throw error;
      
      toast({
        description: isArchived ? "Property unarchived" : "Property archived",
      });
      
      window.location.reload();
    } catch (error) {
      console.error("Error toggling archive status:", error);
      toast({
        title: "Error",
        description: "Failed to update archive status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={handleArchiveToggle}
      disabled={isLoading}
    >
      {isArchived ? (
        <>
          <ArrowUpToLine className="mr-2 h-4 w-4" />
          Unarchive Property
        </>
      ) : (
        <>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Archive Property
        </>
      )}
    </Button>
  );
}
