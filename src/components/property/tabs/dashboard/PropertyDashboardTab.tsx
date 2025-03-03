
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
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard
          id={id}
          objectId={objectId}
          title={title}
          createdAt={createdAt}
          updatedAt={updatedAt}
          onSave={onSave}
          onDelete={onDelete}
          onGeneratePDF={onGeneratePDF}
          onWebView={onWebView}
          onSaveObjectId={onSaveObjectId}
          isUpdating={isUpdating}
        />
        
        <div className="space-y-6">
          <AgentCard
            agentId={agentId}
            agentName={agentName}
            onSaveAgent={onSaveAgent}
          />
          
          <TemplateCard
            templateId={templateId}
            templateName={templateName}
            onSaveTemplate={onSaveTemplate}
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
