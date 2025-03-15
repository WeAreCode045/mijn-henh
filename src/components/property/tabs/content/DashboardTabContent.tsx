import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { ExternalLink, UserPlus, Save, Trash2, Share2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { NotesCard } from "../../dashboard/NotesCard";
import { AgendaCard } from "../../dashboard/AgendaCard";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onSave?: () => void;
  onWebView?: () => void;
  handleSaveAgent?: (agentId: string) => void;
}

export function DashboardTabContent({ 
  property, 
  onDelete, 
  onSave, 
  onWebView,
  handleSaveAgent
}: DashboardTabContentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<{id: string, name: string}[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .or('role.eq.agent,role.eq.admin');
        
        if (error) throw error;
        
        if (data) {
          setAgents(data.map(agent => ({
            id: agent.id,
            name: agent.full_name || 'Unnamed Agent'
          })));
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);

  const handleShare = () => {
    const url = `${window.location.origin}/property/view/${property.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others",
    });
  };

  const handleAgentChange = (agentId: string) => {
    if (handleSaveAgent) {
      const finalAgentId = agentId === "no-agent" ? "" : agentId;
      handleSaveAgent(finalAgentId);
      
      toast({
        title: "Agent updated",
        description: "The property agent has been updated",
      });
    }
  };

  const mainImage = property.featuredImage || (property.images && property.images.length > 0 ? property.images[0].url : null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Property Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
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
                    <p>{"Not specified"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold mb-1">Assigned Agent</p>
                    <Select 
                      value={property.agent_id || 'no-agent'} 
                      onValueChange={handleAgentChange}
                      disabled={isLoadingAgents}
                    >
                      <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-agent">No agent assigned</SelectItem>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
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

        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Actions</CardTitle>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotesCard propertyId={property.id} />
        <AgendaCard propertyId={property.id} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSubmissions propertyId={property.id} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p>{0}</p>
              </div>
              <div>
                <p className="font-medium">Submissions</p>
                <p>{0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
