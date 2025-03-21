
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { PropertyDates } from "./components/PropertyDates";
import { Trash, History, ScanEye, FileText, RotateCcw, Youtube } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { EditHistoryModal } from "./components/EditHistoryModal";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";
import { MediaViewModal } from "@/components/property/MediaViewModal";

interface ActionsCardProps {
  propertyId: string;
  propertyData?: PropertyData;
  createdAt?: string;
  updatedAt?: string;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  onWebView?: (e: React.MouseEvent) => void;
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
  const { generatePDF, isGenerating } = useGeneratePDF();
  
  // Media view modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState<"virtualTour" | "youtube">("virtualTour");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  
  // Prevent event propagation and default behavior for the history button
  const handleHistoryButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditHistory(true);
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    if (propertyData) {
      await generatePDF(propertyData);
    }
  };

  // Handle opening virtual tour modal
  const handleOpenVirtualTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (propertyData?.virtualTourUrl) {
      setMediaType("virtualTour");
      setMediaUrl(propertyData.virtualTourUrl);
      setMediaTitle("Virtual Tour");
      setShowMediaModal(true);
    }
  };

  // Handle opening YouTube video modal
  const handleOpenYoutubeVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (propertyData?.youtubeUrl) {
      setMediaType("youtube");
      setMediaUrl(propertyData.youtubeUrl);
      setMediaTitle("Property Video");
      setShowMediaModal(true);
    }
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
                    onClick={handleGeneratePDF}
                    disabled={isGenerating} 
                    className="flex items-center justify-center rounded-md w-10 h-10 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleOpenVirtualTour}
                    disabled={!propertyData?.virtualTourUrl}
                    className={`flex items-center justify-center rounded-md w-10 h-10 ${
                      propertyData?.virtualTourUrl 
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{propertyData?.virtualTourUrl ? "Open Tour" : "No Virtual Tour"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenYoutubeVideo}
                    disabled={!propertyData?.youtubeUrl}
                    className={`flex items-center justify-center rounded-md w-10 h-10 ${
                      propertyData?.youtubeUrl 
                        ? "bg-red-100 text-red-600 hover:bg-red-200" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <Youtube className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{propertyData?.youtubeUrl ? "Watch Video" : "No Video"}</p>
                </TooltipContent>
              </Tooltip>
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

        {/* Media View Modal */}
        <MediaViewModal
          open={showMediaModal}
          onOpenChange={setShowMediaModal}
          url={mediaUrl}
          title={mediaTitle}
          type={mediaType}
        />
      </CardContent>
    </Card>
  );
}
