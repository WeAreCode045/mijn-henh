
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { PropertyDates } from "./components/PropertyDates";
import { Trash, Eye, FileText, History, ExternalLink, Globe, Youtube } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { EditHistoryModal } from "./components/EditHistoryModal";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
              <TooltipProvider>
                {propertyData?.virtualTourUrl ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={propertyData.virtualTourUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center rounded-md w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open Tour</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-muted-foreground text-sm">Not available</span>
                )}
              </TooltipProvider>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">YouTube Video</p>
              <TooltipProvider>
                {propertyData?.youtubeUrl ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={propertyData.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center rounded-md w-8 h-8 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Watch Video</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-muted-foreground text-sm">Not available</span>
                )}
              </TooltipProvider>
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
