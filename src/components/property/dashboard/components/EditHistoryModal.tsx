
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";

interface EditLogEntry {
  id: string;
  user_name: string;
  field_name: string;
  old_value: string;
  new_value: string;
  created_at: string;
}

interface EditHistoryModalProps {
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHistoryModal({ propertyId, open, onOpenChange }: EditHistoryModalProps) {
  const [logs, setLogs] = useState<EditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && propertyId) {
      fetchEditLogs();
    }
  }, [open, propertyId]);

  const fetchEditLogs = async () => {
    try {
      setIsLoading(true);
      setLogs([]);
      console.log("Fetching edit logs for property:", propertyId);
      
      const { data, error } = await supabase
        .from('property_edit_logs')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching edit logs:", error);
        throw error;
      }

      console.log("Fetched logs:", data?.length || 0);
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching edit logs:", error);
      toast({
        title: "Error",
        description: "Failed to load edit history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a proper dialog state change handler to ensure state is updated correctly
  const handleOpenChange = (newOpenState: boolean) => {
    console.log("Dialog open state changing to:", newOpenState);
    onOpenChange(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Property Edit History
          </DialogTitle>
          <DialogDescription>
            View all changes made to this property
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          {isLoading ? (
            <div className="py-10 text-center">Loading edit history...</div>
          ) : logs.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No edit history found for this property
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{log.field_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                  <div className="text-sm mb-1">
                    <span className="text-muted-foreground">From: </span>
                    <span>{log.old_value || "(empty)"}</span>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">To: </span>
                    <span>{log.new_value || "(empty)"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Changed by: {log.user_name || "Unknown user"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
