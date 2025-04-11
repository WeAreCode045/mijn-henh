
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  StatusSection, 
  AgentSection, 
  ActionButtons, 
  DateInfoSection, 
  ArchiveButton, 
  DeleteButton 
} from "./property-management";

interface PropertyManagementCardProps {
  propertyId: string;
  agentId?: string;
  isArchived?: boolean;
  handleSaveAgent: (agentId: string) => Promise<void>;
  onGeneratePDF: () => void;
  onWebView: (e: React.MouseEvent) => void;
  onDelete: () => Promise<void>;
  createdAt?: string;
  updatedAt?: string;
}

export function PropertyManagementCard({
  propertyId,
  agentId,
  isArchived = false,
  handleSaveAgent,
  onGeneratePDF,
  onWebView,
  onDelete,
  createdAt,
  updatedAt
}: PropertyManagementCardProps) {
  // Log to verify props are received correctly
  console.log("PropertyManagementCard - propertyId:", propertyId);
  console.log("PropertyManagementCard - onGeneratePDF is function:", typeof onGeneratePDF === 'function');
  console.log("PropertyManagementCard - onWebView is function:", typeof onWebView === 'function');

  // Simple wrapper handlers to log actions and ensure proper execution
  const handleGeneratePDF = (e: React.MouseEvent) => {
    console.log("PropertyManagementCard - handleGeneratePDF executing");
    if (typeof onGeneratePDF === 'function') {
      onGeneratePDF();
    } else {
      console.error("PropertyManagementCard - onGeneratePDF is not a function");
    }
  };

  const handleWebView = (e: React.MouseEvent) => {
    console.log("PropertyManagementCard - handleWebView executing with event:", e.type);
    if (typeof onWebView === 'function') {
      onWebView(e);
    } else {
      console.error("PropertyManagementCard - onWebView is not a function");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Property Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusSection 
          propertyId={propertyId}
          isArchived={isArchived}
        />
        
        <AgentSection 
          agentId={agentId}
          handleSaveAgent={handleSaveAgent}
        />
        
        <Separator className="my-4" />
        
        <ActionButtons 
          onGeneratePDF={handleGeneratePDF}
          onWebView={handleWebView}
          isArchived={isArchived}
        />
        
        <DateInfoSection 
          createdAt={createdAt}
          updatedAt={updatedAt}
        />
        
        <Separator className="my-4" />
        
        <ArchiveButton 
          propertyId={propertyId}
          isArchived={isArchived}
        />
        
        <DeleteButton onDelete={onDelete} />
      </CardContent>
    </Card>
  );
}
