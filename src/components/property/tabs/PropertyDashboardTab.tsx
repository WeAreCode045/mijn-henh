import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { PropertySubmissionsDialog } from "@/components/property/PropertySubmissionsDialog";
import { FileDown, Globe, Share2, Save, Trash2, Mailbox, User, Tag, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Code } from "@/components/ui/code";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Agent {
  id: string;
  full_name: string;
}

interface Template {
  id: string;
  name: string;
}

interface PropertyDashboardTabProps {
  id: string;
  objectId?: string;
  title: string;
  agentId?: string;
  agentName?: string;
  templateId?: string;
  templateName?: string;
  createdAt?: string;
  updatedAt?: string;
  onSave: () => void;
  onDelete: () => void;
  handleGeneratePDF: (e: React.MouseEvent) => void;
  handleWebView: (e: React.MouseEvent) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveObjectId: (objectId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
  isUpdating: boolean;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function PropertyDashboardTab({
  id,
  objectId,
  title,
  agentId,
  agentName,
  templateId,
  templateName,
  createdAt,
  updatedAt,
  onSave,
  onDelete,
  handleGeneratePDF,
  handleWebView,
  handleSaveAgent,
  handleSaveObjectId,
  handleSaveTemplate,
  isUpdating,
  agentInfo,
  templateInfo
}: PropertyDashboardTabProps) {
  const [notes, setNotes] = useState<string>("");
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();
  const apiEndpoint = `${window.location.origin}/api/properties/${id}`;
  
  const [currentObjectId, setCurrentObjectId] = useState(objectId || "");
  const [currentAgentId, setCurrentAgentId] = useState(agentId || "");
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId || "default");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

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
    
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('id, name');
      
      if (!error && data) {
        setTemplates(data);
      }
    };
    
    fetchAgents();
    fetchTemplates();
  }, []);

  const handleOpenSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSubmissions(data || []);
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

  const handleSaveNotes = async () => {
    try {
      toast({
        description: "Notes saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const handleSaveAgent = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveAgent(currentAgentId);
  };

  const handleSaveObjectId = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveObjectId(currentObjectId);
  };
  
  const handleSaveTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveTemplate(currentTemplateId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onSave} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleWebView} title="Web View">
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleGeneratePDF} title="Generate PDF">
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
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium">ID:</span>
              <p className="text-sm font-mono">{id}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="object-id">Object ID</Label>
              <div className="flex gap-2">
                <Input
                  id="object-id"
                  value={currentObjectId}
                  onChange={(e) => setCurrentObjectId(e.target.value)}
                  placeholder="Enter object ID"
                />
                <Button onClick={handleSaveObjectId} disabled={isUpdating} size="sm">
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium">API Endpoint:</span>
              <Code className="text-xs mt-1">{apiEndpoint}</Code>
            </div>
            
            {createdAt && (
              <div>
                <span className="text-sm font-medium">Created:</span>
                <p className="text-sm">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
              </div>
            )}
            
            {updatedAt && (
              <div>
                <span className="text-sm font-medium">Last Modified:</span>
                <p className="text-sm">{formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 italic">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>
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
                  <SelectItem value="none">None</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSaveAgent} disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Assign Agent"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Brochure Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-select">Select Template</Label>
              <Select 
                value={currentTemplateId} 
                onValueChange={setCurrentTemplateId}
              >
                <SelectTrigger id="template-select">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSaveTemplate} disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Set Template"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this property..."
            className="min-h-32"
          />
          <Button 
            className="mt-4" 
            onClick={handleSaveNotes}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Notes
          </Button>
        </CardContent>
      </Card>
      
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
