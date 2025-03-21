
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { StatusSelector } from "./components/StatusSelector";
import { AgentSelector } from "./components/AgentSelector";
import { PropertyDates } from "./components/PropertyDates";
import { Trash, Eye, FileText, History } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { EditHistoryModal } from "./components/EditHistoryModal";

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
  const { isAdmin } = useAuth();
  const [showEditHistory, setShowEditHistory] = useState(false);
  
  // Get initial status from propertyData metadata or fall back to status property
  const initialStatus = propertyData?.metadata?.status || propertyData?.status || "Draft";

  // Handle PDF generation using the ActionButtons component
  const onGeneratePDF = async () => {
    // The actual implementation is in ActionButtons component
  };

  // Prevent event propagation and default behavior for the history button
  const handleHistoryButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditHistory(true);
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Actions</CardTitle>
          {propertyId && (
            <div className="text-xs text-muted-foreground font-mono">
              ID: {propertyId}
            </div>
          )}
        </div>
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
        
        <div className="flex space-x-4">
          <button onClick={onDelete} className="bg-red-600 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 flex items-center gap-1 text-white">
            <Trash className="h-5 w-5" />
          </button>
          <button onClick={onWebView} className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 flex items-center gap-1">
            <Eye className="h-5 w-5" />
          </button>
          <button onClick={onGeneratePDF} className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 flex items-center gap-1">
            <FileText className="h-5 w-5" />
          </button>
          {isAdmin && (
            <button 
              onClick={handleHistoryButtonClick} 
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 flex items-center gap-1"
              title="View edit history"
              type="button"
            >
              <History className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {isAdmin && (
          <EditHistoryModal
            propertyId={propertyId}
            open={showEditHistory}
            onOpenChange={setShowEditHistory}
          />
        )}
      </CardContent>
    </Card>
  );
}
