
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentSelector } from "../../../dashboard/components/AgentSelector";
import { PropertyDates } from "../../../dashboard/components/PropertyDates";
import { StatusSelector } from "@/components/property/dashboard/components/StatusSelector";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Youtube, RotateCcw, Share2, Archive, Trash, History } from "lucide-react";
import { useState, useEffect } from "react";
import { MediaViewModal } from "@/components/property/MediaViewModal";
import { supabase } from "@/integrations/supabase/client";
import { EditHistoryModal } from "../../../dashboard/components/EditHistoryModal";
import { useLocation } from "react-router-dom";

interface PropertyManagementCardProps {
  propertyId: string;
  agentId?: string;
  handleSaveAgent: (agentId: string) => Promise<void>;
  onGeneratePDF: () => void;
  onWebView: (e: React.MouseEvent) => void;
  onDelete: () => Promise<void>;
  isArchived: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function PropertyManagementCard({ 
  propertyId, 
  agentId, 
  handleSaveAgent, 
  onGeneratePDF,
  onWebView,
  onDelete,
  isArchived,
  createdAt,
  updatedAt
}: PropertyManagementCardProps) {
  // Get current location for page reloads
  const location = useLocation();

  // Media view modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [mediaType, setMediaType] = useState<"virtualTour" | "youtube">("virtualTour");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const [propertyMedia, setPropertyMedia] = useState<{
    virtualTourUrl?: string;
    youtubeUrl?: string;
  }>({});
  
  // Load virtual tour and youtube URLs
  useEffect(() => {
    const fetchPropertyMedia = async () => {
      if (!propertyId) return;
      
      const { data, error } = await supabase
        .from('properties')
        .select('virtualTourUrl, youtubeUrl')
        .eq('id', propertyId)
        .single();
        
      if (!error && data) {
        setPropertyMedia({
          virtualTourUrl: data.virtualTourUrl,
          youtubeUrl: data.youtubeUrl
        });
      }
    };
    
    fetchPropertyMedia();
  }, [propertyId]);
  
  // Handle opening virtual tour modal
  const handleOpenVirtualTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (propertyMedia.virtualTourUrl) {
      setMediaType("virtualTour");
      setMediaUrl(propertyMedia.virtualTourUrl);
      setMediaTitle("Virtual Tour");
      setShowMediaModal(true);
    }
  };

  // Handle opening YouTube video modal
  const handleOpenYoutubeVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (propertyMedia.youtubeUrl) {
      setMediaType("youtube");
      setMediaUrl(propertyMedia.youtubeUrl);
      setMediaTitle("Property Video");
      setShowMediaModal(true);
    }
  };
  
  // Handle share property
  const handleShareProperty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/property/${propertyId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Property Details',
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      // TODO: Add toast notification
    }
  };

  // Handle toggle archive
  const handleToggleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newArchivedStatus = !isArchived;
      
      const { error } = await supabase
        .from('properties')
        .update({ archived: newArchivedStatus })
        .eq('id', propertyId);
        
      if (error) throw error;
      
      // Reload the current page instead of the entire app
      window.location.href = location.pathname;
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const handleOpenHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowHistoryModal(true);
  };

  // Handle PDF generation with stopPropagation
  const handleGeneratePDF = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onGeneratePDF();
  };

  const handleStatusChange = async (status: string): Promise<void> => {
    if (!propertyId) return;
    
    const { error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', propertyId);
      
    if (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-medium">Property Management</CardTitle>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isArchived ? "default" : "outline"} 
                    size="icon" 
                    onClick={handleToggleArchive}
                    type="button"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isArchived ? "Unarchive Property" : "Archive Property"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleOpenHistory}
                    type="button"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit History</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete();
                    }}
                    type="button"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Property</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PropertyDates createdAt={createdAt} updatedAt={updatedAt} />
          
          <AgentSelector 
            initialAgentId={agentId} 
            onAgentChange={handleSaveAgent}
          />
          
          <div className="mt-2">
            <StatusSelector 
              propertyId={propertyId} 
              initialStatus={""} 
              onStatusChange={handleStatusChange}
            />
          </div>
          
          <div className="mt-4">
            <p className="font-semibold mb-3">Actions</p>
            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={onWebView} 
                      className={`flex items-center justify-center rounded-md w-10 h-10 ${
                        !isArchived
                          ? "bg-gray-100 hover:bg-gray-200" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } transition-colors`}
                      disabled={isArchived}
                      type="button"
                    >
                      <Globe className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isArchived 
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
                      disabled={isArchived} 
                      className={`flex items-center justify-center rounded-md w-10 h-10 ${
                        !isArchived
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } transition-colors`}
                      type="button"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isArchived 
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
                      disabled={!propertyMedia.virtualTourUrl || isArchived}
                      className={`flex items-center justify-center rounded-md w-10 h-10 ${
                        propertyMedia.virtualTourUrl && !isArchived
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } transition-colors`}
                      type="button"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {!propertyMedia.virtualTourUrl 
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
                      disabled={!propertyMedia.youtubeUrl || isArchived}
                      className={`flex items-center justify-center rounded-md w-10 h-10 ${
                        propertyMedia.youtubeUrl && !isArchived
                          ? "bg-red-100 text-red-600 hover:bg-red-200" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } transition-colors`}
                      type="button"
                    >
                      <Youtube className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {!propertyMedia.youtubeUrl 
                        ? "No Video" 
                        : isArchived 
                          ? "Unarchive property first" 
                          : "Watch Video"
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleShareProperty}
                      disabled={isArchived}
                      className={`flex items-center justify-center rounded-md w-10 h-10 ${
                        !isArchived
                          ? "bg-gray-100 hover:bg-gray-200" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } transition-colors`}
                      type="button"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isArchived 
                        ? "Unarchive property first" 
                        : "Share Property"
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Media View Modal */}
      <MediaViewModal
        open={showMediaModal}
        onOpenChange={setShowMediaModal}
        url={mediaUrl}
        title={mediaTitle}
        type={mediaType}
      />
      
      {/* Edit History Modal */}
      <EditHistoryModal
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
        propertyId={propertyId}
      />
    </div>
  );
}
