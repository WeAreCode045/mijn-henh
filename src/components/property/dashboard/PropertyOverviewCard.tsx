
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PropertyOverviewCardProps {
  property: PropertyData;
  handleSaveAgent?: (agentId: string) => void;
}

export function PropertyOverviewCard({ property, handleSaveAgent }: PropertyOverviewCardProps) {
  const [agents, setAgents] = useState<{id: string, name: string}[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const { toast } = useToast();

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
  );
}
