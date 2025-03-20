
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from "date-fns";
import { FileDown, Globe, Share2, Trash2, Mailbox } from "lucide-react";
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

  // This wrapper function allows us to call handleGeneratePDF without passing the event
  const handleGeneratePDFClick = () => {
    handleGeneratePDF();
  };

  // This wrapper function allows us to call handleWebView with a synthetic event
  const handleWebViewClick = () => {
    const syntheticEvent = {} as React.MouseEvent;
    handleWebView(syntheticEvent);
  };

  // Function to generate webview URL using objectId as slug if available
  const getWebViewUrl = () => {
    if (objectId) {
      return `/property/${objectId}/webview`;
    }
    return `/property/${id}/webview`;
  };

  // Format the date properly
  const formatDate = (dateString?: string) => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            asChild
            title="Web View"
          >
            <a href={getWebViewUrl()} target="_blank" rel="noopener noreferrer">
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
            <a href={objectId ? `/share/${objectId}` : `/share/${id}`} target="_blank" rel="noopener noreferrer">
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
          formattedUpdateDate={formatDate(updatedAt)}
          formattedCreateDate={formatDate(createdAt)}
        />
        
        <div className="space-y-6">
          {/* Agent card or other content could go here */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityCard />
        <NotesCard />
      </div>
    </div>
  );
}
