
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { StatusSelector } from "./components/StatusSelector";
import { AgentSelector } from "./components/AgentSelector";
import { PropertyDates } from "./components/PropertyDates";
import { ActionButtons } from "./components/ActionButtons";

interface ActionsCardProps {
  propertyId: string;
  propertyData?: PropertyData;
  createdAt?: string;
  updatedAt?: string;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  onWebView?: (e: React.MouseEvent) => void;
  handleSaveAgent?: (agentId: string) => Promise<void>;
  agentId?: string;
}

export function ActionsCard({ 
  propertyId, 
  propertyData,
  createdAt, 
  updatedAt, 
  onSave, 
  onDelete, 
  onWebView,
  handleSaveAgent,
  agentId
}: ActionsCardProps) {
  // Get initial status from propertyData metadata
  const initialStatus = propertyData?.metadata?.status as string || "Draft";

  // Handle PDF generation using the ActionButtons component
  const onGeneratePDF = async () => {
    // The actual implementation is in ActionButtons component
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PropertyDates createdAt={createdAt} updatedAt={updatedAt} />
        
        <div className="space-y-3">
          <StatusSelector 
            propertyId={propertyId} 
            initialStatus={initialStatus}
          />
          
          {handleSaveAgent && (
            <AgentSelector 
              initialAgentId={agentId} 
              onAgentChange={handleSaveAgent}
            />
          )}
        </div>
        
        <ActionButtons
          propertyId={propertyId}
          propertyData={propertyData}
          onDelete={onDelete}
          onWebView={onWebView}
          onGeneratePDF={onGeneratePDF}
        />
      </CardContent>
    </Card>
  );
}
