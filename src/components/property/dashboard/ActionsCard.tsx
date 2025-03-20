
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";
import { useAgencySettings } from "@/hooks/useAgencySettings";
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
  const { generatePDF, isGenerating } = useGeneratePDF();
  const { settings } = useAgencySettings();

  const handleGeneratePDF = async () => {
    if (!propertyData) {
      return;
    }
    
    try {
      await generatePDF(propertyData);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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
            initialStatus={propertyData?.status}
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
          isGenerating={isGenerating}
          onGeneratePDF={handleGeneratePDF}
        />
      </CardContent>
    </Card>
  );
}
