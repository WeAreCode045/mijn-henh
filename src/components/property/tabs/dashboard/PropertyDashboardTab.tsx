
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "@/types/submission";
import { ActivityCard } from "./cards/ActivityCard";
import { NotesCard } from "../../dashboard/NotesCard";
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";
import { PropertyManagementCard } from "./cards/PropertyManagementCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { AgendaCard } from "../../dashboard/AgendaCard";

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
  const [isArchived, setIsArchived] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      // Validate id is present and valid
      if (!id || id.trim() === '') return;
      
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

    // Fetch property status to check if archived
    const fetchPropertyStatus = async () => {
      // Only fetch if we have a valid ID
      if (!id || id.trim() === '') return;
      
      const { data, error } = await supabase
        .from('properties')
        .select('archived')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        setIsArchived(!!data.archived);
      }
    };

    fetchSubmissions();
    fetchPropertyStatus();
  }, [id, toast]);

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
      {isArchived && (
        <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-md p-3 flex items-center gap-2">
          <span>This property is archived. Editing is disabled until you unarchive it.</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Property Details Card - Takes up 2/3 of the width */}
        <div className="lg:col-span-2">
          <PropertyDetailsCard
            id={id}
            objectId={objectId}
            title={title}
            apiEndpoint={`/api/properties/${id}`}
            createdAt={createdAt}
            updatedAt={updatedAt}
            onSaveObjectId={handleSaveObjectId}
            isUpdating={isUpdating}
            formattedCreateDate={formatDate(createdAt)}
            formattedUpdateDate={formatDate(updatedAt)}
            property={{id, title}}
          />
        </div>
        
        {/* Property Management Card - Takes up 1/3 of the width */}
        <div>
          <PropertyManagementCard 
            propertyId={id}
            agentId={agentId}
            handleSaveAgent={handleSaveAgent}
            onGeneratePDF={handleGeneratePDF}
            onWebView={handleWebView}
            onDelete={onDelete}
            isArchived={isArchived}
            createdAt={createdAt}
            updatedAt={updatedAt}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <ActivityCard />
        <AgendaCard propertyId={id} />
      </div>
      
      <div>
        <NotesCard propertyId={id} />
      </div>
    </div>
  );
}
