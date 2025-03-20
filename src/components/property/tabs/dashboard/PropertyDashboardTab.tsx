
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Mailbox } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "@/types/submission";
import { ActivityCard } from "./cards/ActivityCard";
import { NotesCard } from "./cards/NotesCard";
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";
import { ActionButtons } from "../dashboard/components/ActionButtons";
import { StatusSelector } from "../dashboard/components/StatusSelector";
import { AgentSelector } from "../dashboard/components/AgentSelector";
import { PropertyDates } from "../dashboard/components/PropertyDates";

interface PropertyDashboardTabProps {
  id: string;
  objectId?: string;
  title: string;
  agentId?: string;
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

  // This wrapper function allows us to call handleGeneratePDF without passing the event
  const handleGeneratePDFClick = () => {
    handleGeneratePDF();
  };

  // Format the date properly
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
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
            onClick={handleOpenSubmissions}
            title="Contact Submissions"
          >
            <Mailbox className="h-4 w-4" />
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
          onGeneratePDF={handleGeneratePDFClick}
          onWebView={handleWebView}
          onSave={onSave}
          onDelete={onDelete}
          formattedUpdateDate={formatDate(updatedAt)}
          formattedCreateDate={formatDate(createdAt)}
        />
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Property Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PropertyDates createdAt={createdAt} updatedAt={updatedAt} />
              
              <StatusSelector 
                propertyId={id} 
                initialStatus={""} 
              />
              
              <AgentSelector 
                initialAgentId={agentId} 
                onAgentChange={handleSaveAgent}
              />
              
              <ActionButtons
                propertyId={id}
                onDelete={onDelete}
                onWebView={handleWebView}
                onGeneratePDF={handleGeneratePDFClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityCard />
        <NotesCard />
      </div>
    </div>
  );
}
