
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { ExternalLink, UserPlus, Save, Trash2, Share2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onSave?: () => void;
  onWebView?: () => void;
}

export function DashboardTabContent({ property, onDelete, onSave, onWebView }: DashboardTabContentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShare = () => {
    // Copy the public URL to clipboard
    const url = `${window.location.origin}/property/view/${property.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others",
    });
  };

  const mainImage = property.featuredImage || (property.images && property.images.length > 0 ? property.images[0].url : null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Row 1: Left - Property Overview (3/4 width) */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Property Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Property details */}
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-2">{property.title}</h3>
                <p className="text-muted-foreground mb-4">{property.address}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Price</p>
                    <p>{property.price || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">ID</p>
                    <p className="text-sm truncate">{property.id}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Object ID</p>
                    <p>{property.object_id || "Not set"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Type</p>
                    <p>{property.propertyType || "Not specified"}</p>
                  </div>
                </div>
              </div>
              
              {/* Main image */}
              <div className="w-full md:w-40 h-40 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {mainImage ? (
                  <img 
                    src={mainImage} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Row 1: Right - Dates and Actions (1/4 width) */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Dates & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm">{property.created_at ? formatDate(property.created_at) : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm">{property.updated_at ? formatDate(property.updated_at) : "N/A"}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={onSave}
                className="w-full flex items-center gap-2"
                size="sm"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button 
                onClick={onDelete}
                variant="destructive"
                className="w-full flex items-center gap-2"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button
                onClick={onWebView}
                variant="outline"
                className="w-full flex items-center gap-2"
                size="sm"
              >
                <Globe className="h-4 w-4" />
                Web View
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full flex items-center gap-2"
                size="sm"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Submissions and Agent */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: Submission overview */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSubmissions propertyId={property.id} />
          </CardContent>
        </Card>

        {/* Right: Agent assignment */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Assigned Agent</CardTitle>
          </CardHeader>
          <CardContent>
            {property.agent ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {property.agent.photoUrl ? (
                    <img src={property.agent.photoUrl} alt={property.agent.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg font-medium text-gray-500">
                      {property.agent.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{property.agent.name}</p>
                  {property.agent.email && <p className="text-sm text-muted-foreground">{property.agent.email}</p>}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-3">No agent assigned</p>
                <Button className="flex items-center gap-2" size="sm">
                  <UserPlus className="h-4 w-4" />
                  Assign Agent
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: External Links and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: External Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">External Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-medium">Virtual Tour</p>
                {property.virtualTourUrl ? (
                  <a 
                    href={property.virtualTourUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Open Tour <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not available</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">YouTube Video</p>
                {property.youtubeUrl ? (
                  <a 
                    href={property.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Watch Video <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not available</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Property Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Images</p>
                <p>{property.images ? property.images.length : 0}</p>
              </div>
              <div>
                <p className="font-medium">Floorplans</p>
                <p>{property.floorplans ? property.floorplans.length : 0}</p>
              </div>
              <div>
                <p className="font-medium">Areas</p>
                <p>{property.areas ? property.areas.length : 0}</p>
              </div>
              <div>
                <p className="font-medium">Features</p>
                <p>{property.features ? property.features.length : 0}</p>
              </div>
              <div>
                <p className="font-medium">Webview Opens</p>
                <p>{property.webViewCount || 0}</p>
              </div>
              <div>
                <p className="font-medium">Submissions</p>
                <p>{property.submissionCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
