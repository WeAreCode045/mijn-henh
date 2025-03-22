import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { PropertyDates } from "./components/PropertyDates";
import { Trash, History, ScanEye, FileText, RotateCcw, Youtube, Archive, Clock } from "lucide-react";
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
import { usePropertyArchive } from "@/hooks/usePropertyArchive";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ActionsCardProps {
  propertyId?: string;  // Make propertyId optional
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
  const location = useLocation();
  const [showEditHistory, setShowEditHistory] = useState(false);
  const { generatePDF, isGenerating } = useGeneratePDF();
  const { archiveProperty, unarchiveProperty, isArchiving } = usePropertyArchive();
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  
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
    if (propertyData && !propertyData.archived) {
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

  // Handle archiving property
  const handleArchiveProperty = async () => {
    if (propertyId) {
      const success = await archiveProperty(propertyId);
      if (success) {
        setShowArchiveDialog(false);
        // Reload the current page instead of the entire application
        window.location.href = location.pathname;
      }
    }
  };

  // Handle unarchiving property
  const handleUnarchiveProperty = async () => {
    if (propertyId) {
      const success = await unarchiveProperty(propertyId);
      if (success) {
        setShowUnarchiveDialog(false);
        // Reload the current page instead of the entire application
        window.location.href = location.pathname;
      }
    }
  };

  // Check if edit history button should be shown
  const showEditHistoryButton = isAdmin && propertyId;
  
  // Check if property is archived
  const isArchived = propertyData?.archived || false;

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Actions</CardTitle>
          <div className="flex gap-2">
            {showEditHistoryButton && (
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
              disabled={isArchived}
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isArchived && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-md flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">This property is archived</span>
          </div>
        )}
        
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
                    className={`flex items-center justify-center rounded-md w-10 h-10 ${
                      propertyId && !isArchived
                        ? "bg-gray-100 hover:bg-gray-200" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                    disabled={!propertyId || isArchived}
                  >
                    <ScanEye className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!propertyId 
                      ? "Save property first" 
                      : isArchived 
                        ? "Unarchive property first" 
                        : "Web View"
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || !propertyId || isArchived} 
                    className={`flex items-center justify-center rounded-md w-10 h-10 ${
                      propertyId && !isGenerating && !isArchived
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isGenerating 
                      ? "Generating..." 
                      : !propertyId 
                        ? "Save property first" 
                        : isArchived 
                          ? "Unarchive property first" 
                          : "Generate PDF"
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleOpenVirtualTour}
                    disabled={!propertyData?.virtualTourUrl || isArchived}
                    className={`flex items-center justify-center rounded-md w-10 h-10 ${
                      propertyData?.virtualTourUrl && !isArchived
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!propertyData?.virtualTourUrl 
                      ? "No Virtual Tour" 
                      : isArchived 
                        ? "Unarchive property first" 
                        : "Open Tour"
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenYoutubeVideo}
                    disabled={!propertyData?.youtubeUrl || isArchived}
                    className={`flex items-center justify-center rounded-md w-10 h-10 ${
                      propertyData?.youtubeUrl && !isArchived
                        ? "bg-red-100 text-red-600 hover:bg-red-200" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <Youtube className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!propertyData?.youtubeUrl 
                      ? "No Video" 
                      : isArchived 
                        ? "Unarchive property first" 
                        : "Watch Video"
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Archive/Unarchive Button */}
        {propertyId && (
          <div className="pt-4">
            {isArchived ? (
              <>
                <AlertDialog open={showUnarchiveDialog} onOpenChange={setShowUnarchiveDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={isArchiving}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Unarchive Property
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unarchive this property?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will make the property editable again and enable all functionality.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnarchiveProperty}
                        disabled={isArchiving}
                      >
                        {isArchiving ? "Unarchiving..." : "Unarchive"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={isArchiving}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Property
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Archive this property?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will prevent editing of the property and disable most functionality.
                        You can unarchive the property later if needed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleArchiveProperty}
                        disabled={isArchiving}
                      >
                        {isArchiving ? "Archiving..." : "Archive"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        )}
        
        {isAdmin && propertyId && (
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
