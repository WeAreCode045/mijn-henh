
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { PropertySubmissionsDialog } from "@/components/property/PropertySubmissionsDialog";
import { FileDown, Globe, Share2, Save, Trash2, Mailbox } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Code } from "@/components/ui/code";
import { Submission } from "@/types/submission";
import { ActivityCard } from "./cards/ActivityCard";
import { NotesCard } from "./cards/NotesCard";
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";

interface PropertyDashboardTabProps {
  id: string;
  objectId?: string;
  title: string;
  agentId?: string;
  agentName?: string;
  createdAt?: string;
  updatedAt?: string;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleGeneratePDF: () => void;
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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', id);

      if (error) {
        toast({
          title: "Error fetching submissions",
          description: error.message,
          variant: "destructive"
        });
      } else if (data) {
        const formattedSubmissions: Submission[] = data.map(item => ({
          id: item.id,
          property_id: item.property_id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message || "",
          inquiry_type: item.inquiry_type,
          is_read: !!item.is_read,
          created_at: item.created_at,
          updated_at: item.updated_at,
          agent_id: item.agent_id,
        }));
        setSubmissions(formattedSubmissions);
      }
    };

    fetchSubmissions();
  }, [id, toast]);

  const handleOpenSubmissions = () => {
    setOpenSubmissionsDialog(true);
  };

  const handleMarkAsRead = async (submissionId: string) => {
    const { error } = await supabase
      .from('property_contact_submissions')
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
        description: "The submission has been marked as read."
      });
      
      // Update the submissions list
      setSubmissions(prev => 
        prev.map(sub => sub.id === submissionId ? {...sub, is_read: true} : sub)
      );
    }
  };

  const handleSaveNotes = async (notes: string) => {
    try {
      const { error } = await supabase
        .from('property_notes')
        .insert({ 
          property_id: id, 
          content: notes, 
          title: "Notes" 
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Notes saved",
        description: "The notes have been saved."
      });
    } catch (error: any) {
      toast({
        title: "Error saving notes",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // This wrapper function allows us to call handleGeneratePDF without passing the event
  const handleGeneratePDFClick = () => {
    handleGeneratePDF();
  };

  // This wrapper function allows us to call handleWebView with a synthetic event
  const handleWebViewClick = () => {
    const syntheticEvent = {} as React.MouseEvent;
    handleWebView(syntheticEvent);
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
          onSaveObjectId={handleSaveObjectId}
          isUpdating={isUpdating}
          onGeneratePDF={handleGeneratePDF}
          onWebView={handleWebViewClick}
          onSave={onSave}
          onDelete={onDelete}
        />
        
        <div className="space-y-6">
          {/* Agent card or other content could go here */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityCard />
        <NotesCard />
      </div>
      
      <PropertySubmissionsDialog
        open={openSubmissionsDialog}
        onOpenChange={setOpenSubmissionsDialog}
        propertyTitle={title}
        submissions={submissions}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}
