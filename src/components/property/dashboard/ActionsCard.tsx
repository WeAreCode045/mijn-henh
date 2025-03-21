
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { PropertyDates } from "./components/PropertyDates";
import { Trash, Eye, FileText, History, ExternalLink } from "lucide-react";
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
  onWebView
}: ActionsCardProps) {
  const { isAdmin } = useAuth();
  const [showEditHistory, setShowEditHistory] = useState(false);
  
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
        
        <div className="space-y-2">
          <p className="font-semibold">External Links</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm">Virtual Tour</p>
              {propertyData?.virtualTourUrl ? (
                <a 
                  href={propertyData.virtualTourUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                >
                  Open Tour <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground text-sm">Not available</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">YouTube Video</p>
              {propertyData?.youtubeUrl ? (
                <a 
                  href={propertyData.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                >
                  Watch Video <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground text-sm">Not available</span>
              )}
            </div>
          </div>
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
