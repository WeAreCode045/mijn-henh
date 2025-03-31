
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, FileText, MonitorSmartphone, Trash2, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/dateUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AgentSelector } from "../../../dashboard/components/AgentSelector";
import { StatusSelector } from "../../../dashboard/components/StatusSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PropertyManagementCardProps {
  propertyId: string;
  agentId?: string;
  isArchived?: boolean;
  handleSaveAgent: (agentId: string) => Promise<void>;
  onGeneratePDF: () => void;
  onWebView: (e: React.MouseEvent) => void;
  onDelete: () => Promise<void>;
  createdAt?: string;
  updatedAt?: string;
}

export function PropertyManagementCard({
  propertyId,
  agentId,
  isArchived = false,
  handleSaveAgent,
  onGeneratePDF,
  onWebView,
  onDelete,
  createdAt,
  updatedAt
}: PropertyManagementCardProps) {
  const [status, setStatus] = useState<string>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch current property status when component mounts
    if (propertyId) {
      fetchPropertyStatus();
    }
  }, [propertyId]);

  const fetchPropertyStatus = async () => {
    if (!propertyId) return;
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('status')
        .eq('id', propertyId)
        .single();
        
      if (error) throw error;
      
      if (data && data.status) {
        setStatus(data.status.toLowerCase());
      }
    } catch (error) {
      console.error("Error fetching property status:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!propertyId) return Promise.reject("Property ID is missing");
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);
        
      if (error) throw error;
      
      setStatus(newStatus);
      toast({
        description: `Status updated to ${newStatus}`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      // Reload the page to reflect the changes
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Property Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status selector */}
        <StatusSelector 
          propertyId={propertyId}
          initialStatus={status}
          onStatusChange={handleStatusChange}
        />
        
        {/* Agent selector */}
        <div className="mt-4">
          <AgentSelector 
            initialAgentId={agentId} 
            onAgentChange={handleSaveAgent} 
          />
        </div>
        
        <Separator className="my-4" />
        
        {/* Publication buttons */}
        <div className="space-y-2">
          <Button 
            onClick={onGeneratePDF} 
            variant="outline" 
            className="w-full justify-start" 
            disabled={isArchived}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
          
          <Button 
            onClick={onWebView} 
            variant="outline" 
            className="w-full justify-start" 
            disabled={isArchived}
          >
            <MonitorSmartphone className="mr-2 h-4 w-4" />
            Web View
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        {/* Property info timestamps */}
        {(createdAt || updatedAt) && (
          <div className="space-y-2 text-sm text-muted-foreground">
            {createdAt && (
              <p>Created: {formatDate(createdAt)}</p>
            )}
            {updatedAt && (
              <p>Last updated: {formatDate(updatedAt)}</p>
            )}
          </div>
        )}
        
        <Separator className="my-4" />
        
        {/* Archive/Unarchive button */}
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
        
        {/* Delete Property button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Property
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this property and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
