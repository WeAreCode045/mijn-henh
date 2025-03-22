
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentSelector } from "../../../dashboard/components/AgentSelector";
import { PropertyDates } from "../../../dashboard/components/PropertyDates";
import { StatusSelector } from "../../../dashboard/components/StatusSelector";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Youtube, RotateCcw, Share2 } from "lucide-react";
import { useState } from "react";
import { MediaViewModal } from "@/components/property/MediaViewModal";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { supabase } from "@/integrations/supabase/client";

interface PropertyManagementCardProps {
  propertyId: string;
  agentId?: string;
  handleSaveAgent: (agentId: string) => Promise<void>;
  onGeneratePDF: () => void;
  onWebView: (e: React.MouseEvent) => void;
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
  isArchived,
  createdAt,
  updatedAt
}: PropertyManagementCardProps) {
  // Media view modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState<"virtualTour" | "youtube">("virtualTour");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const [propertyMedia, setPropertyMedia] = useState<{
    virtualTourUrl?: string;
    youtubeUrl?: string;
  }>({});
  
  // Load virtual tour and youtube URLs
  useState(() => {
    const fetchPropertyMedia = async () => {
      if (!propertyId) return;
      
      const { data, error } = await supabase
        .from('properties')
        .select('virtual_tour_url, youtube_url')
        .eq('id', propertyId)
        .single();
        
      if (!error && data) {
        setPropertyMedia({
          virtualTourUrl: data.virtual_tour_url,
          youtubeUrl: data.youtube_url
        });
      }
    };
    
    fetchPropertyMedia();
  });
  
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
  const handleShareProperty = () => {
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Property Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PropertyDates createdAt={createdAt} updatedAt={updatedAt} />
          
          <AgentSelector 
            initialAgentId={agentId} 
            onAgentChange={handleSaveAgent}
          />
          
          <div className="mt-2">
            <p className="font-semibold mb-2">Property Status</p>
            <StatusSelector 
              propertyId={propertyId} 
              initialStatus={""} 
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
                      onClick={onGeneratePDF}
                      disabled={isArchived} 
                      className={`flex items-center justify-center rounded-md w-10 h-10 ${
                        !isArchived
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } transition-colors`}
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
    </div>
  );
}
