
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertySubmissionsDialog } from "@/components/property/PropertySubmissionsDialog";
import { FileDown, Globe, Share2, Save, Trash2, Mailbox, User, Tag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";
import { ActivityCard } from "./cards/ActivityCard";
import { NotesCard } from "./cards/NotesCard";
import { Submission } from "@/types/submission";

interface Agent {
  id: string;
  full_name: string;
}

interface PropertyDashboardTabProps {
  id: string;
  objectId?: string;
  title: string;
  agentId?: string;
  agentName?: string;
  createdAt?: string;
  updatedAt?: string;
  onSave: () => void;
  onDelete: () => void;
  handleGeneratePDF: (e: React.MouseEvent) => void;
  handleWebView: (e: React.MouseEvent) => void;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  isUpdating: boolean;
  agentInfo?: { id: string; name: string } | null;
}

export function PropertyDashboardTab({
  id,
  objectId,
  title,
  agentId,
  agentName,
  createdAt,
  updatedAt,
  onSave,
  onDelete,
  handleGeneratePDF,
  handleWebView,
  handleSaveAgent,
  handleSaveObjectId,
  isUpdating,
  agentInfo
}: PropertyDashboardTabProps) {
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();
  const apiEndpoint = `${window.location.origin}/api/properties/${id}`;
  
  const [currentObjectId, setCurrentObjectId] = useState(objectId || "");
  const [currentAgentId, setCurrentAgentId] = useState(agentId || "");
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'agent');
      
      if (!error && data) {
        setAgents(data);
      }
    };
    
    fetchAgents();
  }, []);

  const handleOpenSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedSubmissions: Submission[] = (data || []).map(item => ({
        id: item.id,
        property_id: item.property_id || "", // Add property_id to fix type error
        name: item.name,
        email: item.email,
        phone: item.phone,
        message: item.message || "",
        inquiry_type: item.inquiry_type,
        is_read: !!item.is_read,
        created_at: item.created_at,
        updated_at: item.updated_at,
        agent_id: item.agent_id
      }));
      
      setSubmissions(formattedSubmissions);
      setIsSubmissionsOpen(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load contact submissions",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);
      
      if (error) throw error;
      
      setSubmissions(prev => 
        prev.map(sub => sub.id === submissionId ? {...sub, is_read: true} : sub)
      );
      
      toast({
        description: "Marked as read",
      });
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  const handleSaveAgentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveAgent(currentAgentId);
  };

  // Create a wrapper function that takes an event parameter
  const handleGeneratePDFWrapper = (e: React.MouseEvent) => {
    e.preventDefault();
    // Call the original handleGeneratePDF
    handleGeneratePDF(e);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onSave} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleWebView}
            title="Web View"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleGeneratePDFWrapper} title="Generate PDF">
            <FileDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            asChild
            title="Share Link"
          >
            <a href={`/share/${id}`} target="_blank" rel="noopener noreferrer">
              <Share2 className="h-4 w-4" />
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleOpenSubmissions}
            title="Contact Submissions"
          >
            <Mailbox className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={onDelete}
            title="Delete Property"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard 
          id={id}
          title={title}
          objectId={objectId}
          createdAt={createdAt}
          updatedAt={updatedAt}
          apiEndpoint={apiEndpoint}
          onSaveObjectId={handleSaveObjectId}
          isUpdating={isUpdating}
        />
        
        <ActivityCard propertyId={id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assigned Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-select">Select Agent</Label>
              <Select 
                value={currentAgentId} 
                onValueChange={setCurrentAgentId}
              >
                <SelectTrigger id="agent-select">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSaveAgentClick} disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Assign Agent"}
            </Button>
          </CardContent>
        </Card>

        <NotesCard propertyId={id} />
      </div>
      
      <PropertySubmissionsDialog 
        open={isSubmissionsOpen}
        onOpenChange={setIsSubmissionsOpen}
        propertyTitle={title}
        submissions={submissions}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}
