
import { PropertyDetailsCard } from './cards/PropertyDetailsCard';
import { ActivityCard } from './cards/ActivityCard';
import { AgentCard } from './cards/AgentCard';
import { TemplateCard } from './cards/TemplateCard';
import { NotesCard } from './cards/NotesCard';
import { PropertySubmissionsDialog } from "@/components/property/PropertySubmissionsDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Globe, Share2, Save, Trash2, Mailbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

export interface PropertyDashboardTabProps {
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
  onDelete: () => Promise<void>;
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  onSaveAgent: (agentId: string) => void;
  onSaveObjectId: (objectId: string) => void;
  onSaveTemplate: (templateId: string) => void;
  isUpdating: boolean;
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
  onGeneratePDF,
  onWebView,
  onSaveAgent,
  onSaveObjectId,
  onSaveTemplate,
  isUpdating
}: PropertyDashboardTabProps) {
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();
  const apiEndpoint = `${window.location.origin}/api/properties/${id}`;

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onSave} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onWebView} title="Web View">
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onGeneratePDF} title="Generate PDF">
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
          createdAt={createdAt}
          updatedAt={updatedAt}
          apiEndpoint={apiEndpoint}
          onSaveObjectId={onSaveObjectId}
          isUpdating={isUpdating}
        />
        
        <ActivityCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentCard 
          agentId={agentId} 
          onSaveAgent={onSaveAgent}
          isUpdating={isUpdating}
        />

        <TemplateCard 
          templateId={templateId} 
          onSaveTemplate={onSaveTemplate}
          isUpdating={isUpdating}  
        />
      </div>
      
      <NotesCard />
      
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
