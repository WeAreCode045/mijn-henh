
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Share2, Globe, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from "@/types/property";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface ActionsCardProps {
  propertyId: string;
  propertyData?: PropertyData;
  createdAt?: string;
  updatedAt?: string;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  onWebView?: (e: React.MouseEvent) => void;
  handleSaveAgent?: (agentId: string) => Promise<void>;
  agentId?: string;
}

export function ActionsCard({ 
  propertyId, 
  propertyData,
  createdAt, 
  updatedAt, 
  onSave, 
  onDelete, 
  onWebView,
  handleSaveAgent,
  agentId
}: ActionsCardProps) {
  const { toast } = useToast();
  const { generatePDF, isGenerating } = useGeneratePDF();
  const { settings } = useAgencySettings();
  const [agents, setAgents] = useState<{id: string, full_name: string}[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState(agentId || "");
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState(propertyData?.status || "Draft");

  useEffect(() => {
    if (agentId !== undefined) {
      setCurrentAgentId(agentId);
    }
  }, [agentId]);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .or('role.eq.agent,role.eq.admin');
        
        if (error) throw error;
        
        if (data) {
          setAgents(data.map(agent => ({
            id: agent.id,
            full_name: agent.full_name || 'Unnamed Agent'
          })));
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentChange = async (agentId: string) => {
    if (handleSaveAgent) {
      const finalAgentId = agentId === "no-agent" ? "" : agentId;
      try {
        await handleSaveAgent(finalAgentId);
        
        toast({
          title: "Agent updated",
          description: "The property agent has been updated",
        });
      } catch (error) {
        console.error("Error saving agent:", error);
        toast({
          title: "Error",
          description: "Failed to update the property agent",
          variant: "destructive",
        });
      }
    }
  };

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

  const handleShare = () => {
    // Use objectId as slug if available, otherwise use id
    const slug = propertyData?.object_id || propertyId;
    const url = `${window.location.origin}/share/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others",
    });
  };

  const handleGeneratePDF = async () => {
    if (!propertyData) {
      toast({
        title: "Error",
        description: "Property data is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await generatePDF(propertyData);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Format date properly
  const formatDateString = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-sm">{createdAt ? formatDateString(createdAt) : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-sm">{updatedAt ? formatDateString(updatedAt) : "N/A"}</p>
          </div>
        </div>
        
        <div className="space-y-3">
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
          
          <div className="space-y-2">
            <Label htmlFor="agent-select">Assigned Agent</Label>
            <Select 
              value={currentAgentId || 'no-agent'} 
              onValueChange={handleAgentChange}
              disabled={isLoadingAgents}
            >
              <SelectTrigger id="agent-select" className="w-full">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-agent">No agent assigned</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={onDelete}
            variant="destructive"
            className="w-full flex items-center gap-2"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button
            onClick={onWebView}
            variant="outline"
            className="w-full flex items-center gap-2"
            size="sm"
            type="button" 
          >
            <Globe className="h-4 w-4" />
            Web View
          </Button>
          <Button
            onClick={handleGeneratePDF}
            variant="outline"
            className="w-full flex items-center gap-2"
            size="sm"
            disabled={isGenerating}
          >
            <FileDown className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate PDF"}
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full flex items-center gap-2"
            size="sm"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
