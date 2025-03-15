
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";
import { TemplateCard } from "./cards/TemplateCard";
import { AgentCard } from "./cards/AgentCard";
import { ActivityCard } from "./cards/ActivityCard";
import { NotesCard } from "./cards/NotesCard";
import { Button } from "@/components/ui/button";
import { FileDown, Globe } from "lucide-react";
import { PropertyData } from "@/types/property";

interface PropertyDashboardTabProps {
  id: string;
  title: string;
  propertyData?: PropertyData; // Add propertyData prop
  objectId?: string;
  agentId?: string;
  templateId?: string;
  templateName?: string;
  createdAt?: string;
  updatedAt?: string;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  onGeneratePDF?: () => void;
  onWebView?: (e?: React.MouseEvent) => void;
  onSaveAgent?: (agentId: string) => void;
  onSaveObjectId?: (objectId: string) => void;
  onSaveTemplate?: (templateId: string) => void;
  isUpdating?: boolean;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function PropertyDashboardTab({
  id,
  title,
  propertyData, // Add propertyData prop here
  objectId,
  agentId,
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
  isUpdating = false,
  agentInfo,
  templateInfo
}: PropertyDashboardTabProps) {
  // Construct the API endpoint with the proper ID
  const apiEndpoint = `/api/properties/${id}`;
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          {onWebView && (
            <Button variant="outline" size="sm" onClick={onWebView} title="Web View">
              <Globe className="h-4 w-4 mr-2" />
              Web View
            </Button>
          )}
          {onGeneratePDF && (
            <Button variant="outline" size="sm" onClick={onGeneratePDF} title="Generate PDF">
              <FileDown className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
          )}
        </div>
      </div>
      
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
            agentName={agentInfo?.name}
            onSaveAgent={onSaveAgent || (() => {})}
            isUpdating={isUpdating}
          />
          
          <TemplateCard
            templateId={templateId}
            templateName={templateName || templateInfo?.name}
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
