
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { PropertyDates } from "./components/PropertyDates";
import { Trash, History, ScanEye, Image, RotateCcw, Youtube } from "lucide-react";
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
          <div className="flex gap-2">
            {isAdmin && (
              <button 
                onClick={handleHistoryButtonClick} 
                className="flex items-center justify-center rounded-md w-8 h-8 bg-gray-100 hover:bg-gray-200 transition-colors"
                title="View edit history"
                type="button"
              >
                <History className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={onDelete} 
              className="flex items-center justify-center rounded-md w-8 h-8 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              title="Delete property"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {propertyId && (
          <div className="text-xs text-muted-foreground font-mono">
            ID: {propertyId}
          </div>
        )}
        
        <PropertyDates createdAt={createdAt} updatedAt={updatedAt} />
        
        <div>
          <p className="font-semibold mb-3">Property Views</p>
          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onWebView} 
                    className="flex items-center justify-center rounded-md w-10 h-10 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ScanEye className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Web View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onGeneratePDF} 
                    className="flex items-center justify-center rounded-md w-10 h-10 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              {propertyData?.virtualTourUrl ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={propertyData.virtualTourUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center rounded-md w-10 h-10 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Virtual Tour</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button 
                  disabled
                  className="flex items-center justify-center rounded-md w-10 h-10 bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              )}
            </TooltipProvider>

            <TooltipProvider>
              {propertyData?.youtubeUrl ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={propertyData.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center rounded-md w-10 h-10 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>YouTube Video</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button 
                  disabled
                  className="flex items-center justify-center rounded-md w-10 h-10 bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  <Youtube className="h-5 w-5" />
                </button>
              )}
            </TooltipProvider>
          </div>
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
