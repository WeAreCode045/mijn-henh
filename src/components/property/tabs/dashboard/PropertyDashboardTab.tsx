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
  handleGeneratePDF: () => void;
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
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(agentId);
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(objectId);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(templateId);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('property_id', id);

      if (error) {
        toast({
          title: "Error fetching submissions",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSubmissions(data || []);
      }
    };

    fetchSubmissions();
  }, [id, toast]);

  const handleOpenSubmissions = () => {
    setOpenSubmissionsDialog(true);
  };

  const handleMarkAsRead = async (submissionId: string) => {
    const { error } = await supabase
      .from('property_submissions')
      .update({ is_read: true })
      .eq('id', submissionId);

    if (error) {
      toast({
        title: "Error marking submission as read",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Submission marked as read",
        description: "The submission has been marked as read.",
        variant: "success"
      });
    }
  };

  const handleSaveNotes = async (notes: string) => {
    const { error } = await supabase
      .from('property_notes')
      .insert({ property_id: id, notes });

    if (error) {
      toast({
        title: "Error saving notes",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Notes saved",
        description: "The notes have been saved.",
        variant: "success"
      });
    }
  };

  const handleSaveAgentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveAgent(currentAgentId);
  };

  const handleSaveObjectIdClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveObjectId(currentObjectId);
  };
  
  const handleSaveTemplateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveTemplate(currentTemplateId);
  };

  const handleGeneratePDFClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleGeneratePDF();
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
            asChild
            title="Web View"
          >
            <a href={`/property/${id}/webview`} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" onClick={handleGeneratePDFClick} title="Generate PDF">
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
          objectId={objectId}
          title={title}
          createdAt={createdAt}
          updatedAt={updatedAt}
          apiEndpoint={`/api/properties/${id}`}
          onSaveObjectId={handleSaveObjectIdClick}
          isUpdating={isUpdating}
          onGeneratePDF={handleGeneratePDF}
          onWebView={handleWebView}
          onSave={onSave}
          onDelete={onDelete}
        />
        
        <div className="space-y-6">
          <TemplateCard
            templateId={templateId}
            templateName={templateName || templateInfo?.name}
            onSaveTemplate={handleSaveTemplateClick}
            isUpdating={isUpdating}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityCard />
        <NotesCard />
      </div>
      
      <PropertySubmissionsDialog
        open={openSubmissionsDialog}
        onClose={() => setOpenSubmissionsDialog(false)}
        submissions={submissions}
        onMarkAsRead={handleMarkAsRead}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
}
