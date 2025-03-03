
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";
import { TemplateCard } from "./cards/TemplateCard";
import { AgentCard } from "./cards/AgentCard";
import { ActivityCard } from "./cards/ActivityCard";
import { NotesCard } from "./cards/NotesCard";

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
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  onGeneratePDF?: () => void;
  onWebView?: () => void;
  onSaveAgent?: (agentId: string) => void;
  onSaveObjectId?: (objectId: string) => void;
  onSaveTemplate?: (templateId: string) => void;
  isUpdating?: boolean;
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
  isUpdating = false
}: PropertyDashboardTabProps) {
  // Construct the API endpoint with the proper ID
  const apiEndpoint = `/api/properties/${id}`;
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard
          id={id}
          objectId={objectId}
          title={title}
          createdAt={createdAt}
          updatedAt={updatedAt}
          apiEndpoint={apiEndpoint}
          onSaveObjectId={onSaveObjectId || (() => {})}
          isUpdating={isUpdating}
          onGeneratePDF={onGeneratePDF}
          onWebView={onWebView}
          onSave={onSave}
          onDelete={onDelete}
        />
        
        <div className="space-y-6">
          <AgentCard
            agentId={agentId}
            agentName={agentName}
            onSaveAgent={onSaveAgent || (() => {})}
            isUpdating={isUpdating}
          />
          
          <TemplateCard
            templateId={templateId}
            templateName={templateName}
            onSaveTemplate={onSaveTemplate || (() => {})}
            isUpdating={isUpdating}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityCard />
        <NotesCard />
      </div>
    </div>
  );
}
